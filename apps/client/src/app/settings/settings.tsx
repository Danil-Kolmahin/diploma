import { AppShell, Group, Header, Navbar, useMantineTheme } from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import { useState } from 'react';

export const Settings = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const [text, setText] = useState('Settings...')

  return (
    <AppShell
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

      <p>{text}</p>
      <button onClick={() => {
        setText(text + setText)
      }}>Button</button>

    </AppShell>
  );
};
