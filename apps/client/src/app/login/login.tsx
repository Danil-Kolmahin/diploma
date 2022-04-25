import React, { useState } from 'react';
import { useForm } from '@mantine/hooks';
import {
  TextInput,
  PasswordInput,
  Group,
  Checkbox,
  Button,
  Paper,
  Text,
  LoadingOverlay,
  Anchor,
  useMantineTheme,
} from '@mantine/core';
import { Lock, Mail } from 'tabler-icons-react';
import { useMatch, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { APP_THEMES, DEFAULT_REDIRECT_ROUTE, ROUTES } from '@diploma-v2/common/constants-common';

const CREATE_NEW_USER = gql`
  mutation signUp (
    $email: String!
    $password: String!
  ) {
    signUp(
      email: $email
      password: $password
    ) {
      id
    }
  }
`;

const LOGIN = gql`
  mutation signIn (
    $email: String!
    $password: String!
  ) {
    signIn(
      email: $email
      password: $password
    )
  }
`;

export const Login = () => {
    const isRegister = useMatch('register');
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useMantineTheme();

    const form = useForm({
      initialValues: {
        email: '',
        password: '',
        confirmPassword: '',
        termsOfService: true,
      },

      validationRules: {
        email: (value) => /^\S+@\S+\.\S+$/.test(value),
        password: (value) => !!value,
        confirmPassword: (val, values) => !isRegister || val === values?.password,
      },

      errorMessages: {
        email: 'Invalid email',
        password: 'Password should contain at least 1 character',
        confirmPassword: 'Passwords don\'t match. Try again',
      },
    });

    const toggleFormType = () => {
      setError('');
      navigate(isRegister ? ROUTES.LOGIN : ROUTES.REGISTER);
    };

    const [createUser] = useMutation(CREATE_NEW_USER);
    const [login] = useMutation(LOGIN);

    const handleSubmit = async (values: typeof form.values) => {
      setLoading(true);
      setError('');
      try {
        isRegister && await createUser({
          variables: { email: values.email, password: values.password },
        });
        await login({
          variables: { email: values.email, password: values.password },
        });
        navigate(DEFAULT_REDIRECT_ROUTE);
      } catch (e: any) {
        setError(e.message ? e.message : 'Server error');
      }
      setLoading(false);
    };

    return (
      <Group style={{
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Paper
          p={'lg'}
          shadow={'sm'}
          style={{
            maxWidth: 400,
            backgroundColor: theme.colorScheme === APP_THEMES.DARK ? theme.colors.dark[7] : theme.white,
          }}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={loading} />

            <TextInput
              required
              placeholder='Your email'
              label='Email'
              icon={<Mail />}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              mt='md'
              required
              placeholder='Password'
              label='Password'
              icon={<Lock />}
              {...form.getInputProps('password')}
            />

            {isRegister && (
              <PasswordInput
                mt='md'
                required
                label='Confirm Password'
                placeholder='Confirm password'
                icon={<Lock />}
                {...form.getInputProps('confirmPassword')}
              />
            )}

            {isRegister && (
              <Checkbox
                mt='xl'
                label='I agree to sell my soul and privacy to this corporation'
                {...form.getInputProps('termsOfService', { type: 'checkbox' })}
              />
            )}

            {(error) && (
              <Text color='red' size='sm' mt='sm'>
                {error}
              </Text>
            )}

            {
              <Group position='apart' mt='xl'>
                <Anchor
                  component='button'
                  type='button'
                  color='gray'
                  onClick={toggleFormType}
                  size='sm'
                >
                  {isRegister
                    ? 'Have an account? Login'
                    : 'Don\'t have an account? Register'}
                </Anchor>

                <Button color='blue' type='submit'>
                  {isRegister ? 'Register' : 'Login'}
                </Button>
              </Group>
            }
          </form>
        </Paper>
      </Group>
    );
  }
;
