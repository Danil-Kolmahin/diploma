import React from 'react';
import { Logout } from 'tabler-icons-react';
import { UnstyledButton, Group, Avatar, Text, Box, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { convertToHex } from '@diploma-v2/common/utils-common';

const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

export const User = ({ parsedCookie: { email, id } }: any) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const [logout, {
    loading: logoutLoading, error: logoutError,
  }] = useMutation(LOGOUT);

  return (
    <Box
      sx={{
        borderTop: `1px solid ${
          theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        }}
        onClick={async () => {
          await logout();
          !logoutLoading && !logoutError && navigate('/login');
        }}
      >
        <Group>
          <Avatar
            src={`https://gravatar.com/avatar/${convertToHex(id)}?s=400&d=retro&r=x`}
          />
          <Box sx={{ flex: 1 }}>
            <Text size='sm' weight={500}>
              {email}
            </Text>
          </Box>
          <Logout size={18} />
        </Group>
      </UnstyledButton>
    </Box>
  );
};
