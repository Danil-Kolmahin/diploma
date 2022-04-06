import {
  AppShell, Group, Header, Navbar, useMantineTheme, Text, Textarea,
  Button,
  Accordion,
  useAccordionState,
  Grid,
  Center,
  Highlight,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React, { useRef, useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { APP_THEMES } from '@diploma-v2/common/constants-common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Greedy } from 'string-mismatch';

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const SimpleDifference = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const [state, handlers] = useAccordionState({ total: 2, initialItem: 0 });
  const [firstText, setFirstText] = useState('');
  const [secondText, setSecondText] = useState('');
  const [highlight, setHighlight] = useState<string[]>([]);
  const [isCompared, setIsCompared] = useState(false);
  const openRef = useRef<() => void>();

  return <AppShell
    fixed
    navbar={
      <Navbar width={{ base: 250 }} p='xs'>
        <MainLinks />
      </Navbar>
    }
    header={
      <Header height={60}>
        <Group sx={{ height: '100%' }} px={20} position='apart'>
          <Logo colorScheme={theme.colorScheme} />
          <User parsedCookie={parsedCookie} />
        </Group>
      </Header>
    }
  >

    <Grid justify='space-around'>

      <Grid.Col span={12}><Center>
        <Text
          component='span'
          align='center'
          size='xl'
          weight={700}
          color={theme.colorScheme === APP_THEMES.DARK ? '#fff' : '#000'}
        >
          Comparing two texts
        </Text>
      </Center></Grid.Col>

      {Object.values(state).some(Boolean) && <>
        <Grid.Col span={3}><Center>
          <Button color={'green'} onClick={() => {
            const differences = (new Greedy()).differences(firstText, secondText);
            const newHighlights: string[] = [];
            (differences).forEach(({type, value}: {type: string, value: string}) => {
              if (type !== 'eql') return;
              if (value.split(/\s/).length < 8) return;
              newHighlights.push(value);
            })
            setHighlight(newHighlights)
            setIsCompared(true);
          }}>
            Compare
          </Button>
        </Center></Grid.Col>

        <Grid.Col span={3}><Center>
          <Button onClick={async () => {
            if (state[0]) setFirstText(
              firstText + await navigator.clipboard.readText(),
            );
            if (state[1]) setSecondText(
              secondText + await navigator.clipboard.readText(),
            );
          }}>
            Push from clipboard
          </Button>
        </Center></Grid.Col>

        <Grid.Col span={3}><Center>
          <Dropzone onDrop={async (files) => {
            const result = (await Promise.all(files
              .map(async (file) => await getBase64(file))))
              .join('\n');
            if (state[0]) setFirstText(firstText + result);
            if (state[1]) setSecondText(secondText + result);
          }} openRef={openRef as any} style={{ display: 'none' }}>
            {() => <div>Select files</div>}
          </Dropzone>
          <Button onClick={() => (openRef as any).current()}>Select files</Button>
        </Center></Grid.Col>

        <Grid.Col span={3}><Center>
          <Button color={'red'} onClick={() => {
            if (state[0]) setFirstText('');
            if (state[1]) setSecondText('');
          }}>
            Clear
          </Button>
        </Center></Grid.Col>
      </>}

      <Grid.Col span={12}>
        <Accordion state={state} onChange={handlers.setState} iconPosition='right'>


          <Accordion.Item label='First text'>
            {isCompared ?
              <Highlight
                highlight={highlight} onClick={() => isCompared && setIsCompared(false)}
              >{firstText}</Highlight>
              :
              <Textarea
                variant={'default'}
                autosize
                value={firstText}
                minRows={10}
                maxRows={10}
                onChange={(event) => setFirstText(event.currentTarget.value)}
              />
            }
          </Accordion.Item>

          <Accordion.Item label='Second text'>
            {isCompared ?
              <Highlight
                highlight={highlight} onClick={() => isCompared && setIsCompared(false)}
              >{secondText}</Highlight>
              :
              <Textarea
                variant={'default'}
                value={secondText}
                autosize
                minRows={10}
                maxRows={10}
                onChange={(event) => setSecondText(event.currentTarget.value)}
              />
            }
          </Accordion.Item>


        </Accordion>
      </Grid.Col>

    </Grid>

  </AppShell>;
};
