import React from 'react';
import { ActionIcon, AppShell, Group, Header, Navbar, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import { MoonStars, Sun } from 'tabler-icons-react';
import { APP_THEMES } from '@diploma-v2/common/constants-common';

export const Settings = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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

      <ActionIcon variant='default' onClick={() => toggleColorScheme()} size={30}>
        {colorScheme === APP_THEMES.DARK ? <Sun size={16} /> : <MoonStars size={16} />}
      </ActionIcon>

    </AppShell>
  );
};
