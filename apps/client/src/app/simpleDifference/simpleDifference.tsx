import {
  AppShell, Group, Header, Navbar, useMantineTheme, Text, Textarea,
  Button,
  Accordion,
  useAccordionState,
  Grid,
  Center,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React, { useRef, useState } from 'react';
import { Dropzone } from '@mantine/dropzone';

export const SimpleDifference = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const [state, handlers] = useAccordionState({ total: 2, initialItem: 0 });
  const [firstText, setFirstText] = useState('');
  const [secondText, setSecondText] = useState('');
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
          color={theme.colorScheme === 'dark' ? '#fff' : '#000'}
        >
          Comparing two texts
        </Text>
      </Center></Grid.Col>

      {Object.values(state).some(Boolean) && <>
        <Grid.Col span={3}><Center>
          <Button color={'green'} onClick={() => ({})}>
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
          <Dropzone onDrop={(...a) => (console.log(a))} openRef={openRef as any} style={{ display: 'none' }}>
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
            <Textarea
              variant={'default'}
              value={firstText}
              autosize
              minRows={10}
              maxRows={10}
              onChange={(event) => setFirstText(event.currentTarget.value)}
            />
          </Accordion.Item>

          <Accordion.Item label='Second text'>
            <Textarea
              variant={'default'}
              value={secondText}
              autosize
              minRows={10}
              maxRows={10}
              onChange={(event) => setSecondText(event.currentTarget.value)}
            />
          </Accordion.Item>

        </Accordion>
      </Grid.Col>

    </Grid>

  </AppShell>;
};
