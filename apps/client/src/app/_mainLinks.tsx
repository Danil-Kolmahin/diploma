import React from 'react';
import { Settings, FileDiff } from 'tabler-icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function MainLinks() {
  const navigate = useNavigate();

  return <div>
    {
      [
        { icon: <FileDiff size={16} />, color: 'orange', label: 'Simple difference', url: '/simple-difference' },
        { icon: <Settings size={16} />, color: 'green', label: 'Settings', url: '/settings' },
      ]
        .map(({ icon, color, label, url }) => <UnstyledButton
          onClick={() => navigate(url)}
          key={label}
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <ThemeIcon color={color} variant='light'>
              {icon}
            </ThemeIcon>

            <Text size='sm'>{label}</Text>
          </Group>
        </UnstyledButton>)
    }
  </div>;
}
