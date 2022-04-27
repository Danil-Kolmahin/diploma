import React from 'react';
import { Settings, FileDiff, History, FileCertificate, Tournament } from 'tabler-icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { APP_THEMES, ROUTES } from '@diploma-v2/common/constants-common';

export function MainLinks() {
  const navigate = useNavigate();

  return <div>
    {
      [
        { icon: <FileDiff size={16} />, color: 'orange', label: 'Simple difference', url: ROUTES.SIMPLE_DIFF },
        { icon: <FileCertificate size={16} />, color: 'yellow', label: 'Deep analyze', url: ROUTES.DEEP_ANALYZE },
        { icon: <History size={16} />, color: 'teal', label: 'History', url: ROUTES.HISTORY },
        { icon: <Tournament size={16} />, color: 'violet', label: 'Robots', url: ROUTES.ROBOTS },
        { icon: <Settings size={16} />, color: 'green', label: 'Settings', url: ROUTES.SETTINGS },
      ]
        .map(({ icon, color, label, url }) => <UnstyledButton
          onClick={() => navigate(url)}
          key={label}
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color: theme.colorScheme === APP_THEMES.DARK ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === APP_THEMES.DARK ? theme.colors.dark[6] : theme.colors.gray[0],
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
