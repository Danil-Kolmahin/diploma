import {
  AppShell, Group, Header, Navbar, useMantineTheme, Text, Textarea,
  Button,
  Grid,
  Center,
  Highlight,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React, { useRef, useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import { APP_THEMES, SESSION_STORAGE } from '@diploma-v2/common/constants-common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Greedy } from 'string-mismatch';
import { Clipboard, Download, Eraser } from 'tabler-icons-react';


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
  const [firstText, setFirstText] = useState(() => sessionStorage
    .getItem(SESSION_STORAGE.APP_SIMPLE_DIFF_TEXT1) || '',
  );
  const [secondText, setSecondText] = useState(() => sessionStorage
    .getItem(SESSION_STORAGE.APP_SIMPLE_DIFF_TEXT2) || '',
  );
  const [highlight, setHighlight] = useState<string[]>([]);
  const [isCompared, setIsCompared] = useState(false);
  const openRef1 = useRef<() => void>();
  const openRef2 = useRef<() => void>();

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

        <Grid.Col span={1}><Center>
          <Tooltip label='Push from clipboard' withArrow>
            <ActionIcon color='blue' variant='filled' onClick={async () => setFirstText(
                firstText + await navigator.clipboard.readText(),
            )}>
              <Clipboard />
            </ActionIcon>
          </Tooltip>
        </Center></Grid.Col>

        <Grid.Col span={1}><Center>
          <Dropzone onDrop={async (files) => {
            const result = (await Promise.all(files
              .map(async (file) => await getBase64(file))))
              .join('\n');
            setFirstText(firstText + result);
          }} openRef={openRef1 as any} style={{ display: 'none' }}>
            {() => <div>Select files</div>}
          </Dropzone>
          <Tooltip label='Select files' withArrow>
            <ActionIcon
              color='blue'
              variant='filled'
              onClick={() => (openRef1 as any).current()}
            >
              <Download />
            </ActionIcon>
          </Tooltip>
        </Center></Grid.Col>

        <Grid.Col span={1}><Center>
          <Tooltip label='Clear' withArrow>
            <ActionIcon color='red' variant='filled' onClick={() => setFirstText('')}>
              <Eraser />
            </ActionIcon>
          </Tooltip>
        </Center></Grid.Col>

        <Grid.Col span={3} offset={1.5}><Center>
          <Button color={'green'} onClick={() => {
            const differences = (new Greedy()).differences(firstText, secondText);
            const newHighlights: string[] = [];
            (differences).forEach(({ type, value }: { type: string, value: string }) => {
              if (type !== 'eql') return;
              if (value.split(/\s/).length < 8) return;
              newHighlights.push(value);
            });
            setHighlight(newHighlights);
            setIsCompared(true);
          }}>
            Compare
          </Button>
        </Center></Grid.Col>

        <Grid.Col span={1} offset={1.5}><Center>
          <Tooltip label='Push from clipboard' withArrow>
            <ActionIcon color='blue' variant='filled' onClick={async () => setSecondText(
                secondText + await navigator.clipboard.readText(),
            )}>
              <Clipboard />
            </ActionIcon>
          </Tooltip>
        </Center></Grid.Col>

        <Grid.Col span={1}><Center>
          <Dropzone onDrop={async (files) => {
            const result = (await Promise.all(files
              .map(async (file) => await getBase64(file))))
              .join('\n');
            setSecondText(secondText + result);
          }} openRef={openRef2 as any} style={{ display: 'none' }}>
            {() => <div>Select files</div>}
          </Dropzone>
          <Tooltip label='Select files' withArrow>
            <ActionIcon
              color='blue'
              variant='filled'
              onClick={() => (openRef2 as any).current()}
            >
              <Download />
            </ActionIcon>
          </Tooltip>
        </Center></Grid.Col>

        <Grid.Col span={1}><Center>
          <Tooltip label='Clear' withArrow>
            <ActionIcon color='red' variant='filled' onClick={() => setSecondText('')}>
              <Eraser />
            </ActionIcon>
          </Tooltip>
        </Center></Grid.Col>

      <Grid.Col span={6}>
        {isCompared ?
          <Highlight
            highlight={highlight} onClick={() => isCompared && setIsCompared(false)}
          >{firstText}</Highlight>
          :
          <Textarea
            variant={'default'}
            autosize
            value={firstText}
            minRows={15}
            maxRows={15}
            onChange={(event) => setFirstText(event.currentTarget.value)}
          />
        }
      </Grid.Col>
      <Grid.Col span={6}>
        {isCompared ?
          <Highlight
            highlight={highlight} onClick={() => isCompared && setIsCompared(false)}
          >{secondText}</Highlight>
          :
          <Textarea
            variant={'default'}
            value={secondText}
            autosize
            minRows={15}
            maxRows={15}
            onChange={(event) => setSecondText(event.currentTarget.value)}
          />
        }
      </Grid.Col>

    </Grid>

  </AppShell>;
};
