import React from 'react';
import { AppShell, Group, Header, Navbar, useMantineTheme, Title } from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import { APP_THEMES } from '@diploma-v2/common/constants-common';

export const NotFound = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();

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

      <Group style={{
        height: '100%',
        textAlign: 'center',
      }}>
        <Title
          order={1}
          align='center'
          style={{
            color: theme.colorScheme === APP_THEMES.DARK ? '#fff' : '#000',
            width: '100%',
            fontSize: 80,
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
        >
          404 not found
        </Title>
      </Group>

    </AppShell>
  );
};
