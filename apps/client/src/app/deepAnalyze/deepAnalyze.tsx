import {
  AppShell, Group, Header, Navbar, useMantineTheme,
  Button,
  MultiSelect,
  ActionIcon,
  TextInput, Chip, Chips, Grid, Center,
} from '@mantine/core';
import { MainLinks } from '../_mainLinks';
import { Logo } from '../_logo';
import { User } from '../_user';
import React, { useRef, useState } from 'react';
import { Files, File, Folder, NewSection, Trash } from 'tabler-icons-react';
import { formList, useForm } from '@mantine/form';
import { renameFile } from '@diploma-v2/frontend/utils-frontend';

const POSSIBLE_FILE_TYPES: { [key: string]: string[] } = {
  'JavaScript': ['.js', '.jsx'],
  'TypeScript': ['.ts', '.tsx'],
};

export const DeepAnalyze = ({ parsedCookie }: any) => {
  const theme = useMantineTheme();
  const refs = useRef([]);
  const [isFileSearch, setIsFileSearch] = useState(true);
  const form = useForm({
    initialValues: {
      projects: formList<{ name: string, creatorName: string, files: File[] }>([
        { name: 'Project #1', creatorName: 'unknown', files: [] },
        { name: 'Project #2', creatorName: 'unknown', files: [] },
      ]),
      fileTypes: Object.keys(POSSIBLE_FILE_TYPES),
    },
  });

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
      <Grid.Col span={3}><Center><Button
        color={'green'}
        onClick={() => console.log(form.values.projects)}
      >
        Compare
      </Button></Center></Grid.Col>

      <Grid.Col span={3}><Center><Button
        leftIcon={isFileSearch ? <Folder /> : <File />}
        onClick={() => setIsFileSearch(!isFileSearch)}
      >
        {isFileSearch ? 'Search for folders' : 'Search for files'}
      </Button></Center></Grid.Col>

      <Grid.Col span={6}><Center><Chips multiple {...form.getInputProps('fileTypes')}>
        {Object.entries(POSSIBLE_FILE_TYPES).map(
          ([key]) => <Chip key={key} value={key}>
            {key}
          </Chip>,
        )}
      </Chips></Center></Grid.Col>

      <Grid.Col span={12}>{form.values.projects.map((_, index) => (
        <Group key={index} mt='xs'>
          <TextInput
            placeholder='Project name'
            sx={{ flex: 1 }}
            {...form.getListInputProps('projects', index, 'name')}
          />
          <TextInput
            placeholder='Project creator'
            sx={{ flex: 1 }}
            {...form.getListInputProps('projects', index, 'creatorName')}
          />
          <input
            type='file'
            multiple
            style={{ display: 'none' }}
            accept={form.values.fileTypes.map(
              (type) => POSSIBLE_FILE_TYPES[type].join(', '),
            ).join(', ')}
            ref={(element) => {
              if (element !== null) {
                if (isFileSearch) {
                  element.removeAttribute('directory');
                  element.removeAttribute('webkitDirectory');
                } else {
                  element.setAttribute('directory', '');
                  element.setAttribute('webkitDirectory', '');
                }
              }
              return refs.current[index] = element as never;
            }}
            onChange={async ({ target: { files } }) => {
              const checkRegEx = new RegExp(
                `([.](${form.values.fileTypes.map(
              (type) => POSSIBLE_FILE_TYPES[type].map((t: string) => t.slice(1)).join('|'),
            ).join('|')}))$`,
              );
              form.setValues((prevState) => {
                if (!files || !files.length) return prevState;
                for (let i = 0; i < files.length; i++) {
                  let file = files[i];
                  if (!checkRegEx.test(file.name)) continue;
                  if (prevState.projects[index].files.find(
                    ({ name }) => name === file.name,
                  )) {
                    let num = 1;
                    const findMore = (num: number) => prevState.projects[index].files.find(
                      ({ name }) => name === `(${num})${file.name}`,
                    );
                    while (findMore(num)) num++;
                    file = renameFile(file, `(${num})${file.name}`);
                  }
                  prevState.projects[index].files.push(file);
                }
                return prevState;
              });
              form.clearErrors();
            }}
          />
          <MultiSelect
            placeholder='Pick project files'
            clearable
            icon={<Files />}
            style={{ maxWidth: '60%', minWidth: '30%' }}
            {...form.getListInputProps('projects', index, 'files')}
            data={form
              .getListInputProps('projects', index, 'files')
              .value.map(
                (file: File) => ({ value: file.name, label: file.name }),
              )
            }
            value={form
              .getListInputProps('projects', index, 'files')
              .value.map((file: File) => file.name)}
            onDropdownOpen={() => (refs.current[index] as HTMLInputElement).click()}
          />
          <ActionIcon
            color='red'
            variant='hover'
            disabled={form.values.projects.length <= 2}
            onClick={() => form.removeListItem('projects', index)}
          >
            <Trash size={16} />
          </ActionIcon>
        </Group>
      ))}</Grid.Col>

      <Grid.Col span={3}><Center><Button
        leftIcon={<NewSection />}
        onClick={() => form.addListItem('projects', {
          name: `Project #${form.values.projects.length + 1}`,
          creatorName: 'unknown',
          files: [],
        })}
      >
        Add project to compare
      </Button></Center></Grid.Col>
    </Grid>

  </AppShell>;
};
