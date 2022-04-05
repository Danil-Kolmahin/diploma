import { Routes, Route } from 'react-router-dom';
// import styled from '@emotion/styled';
import { Main } from './main/main';
import { Login } from './login/login';
import { Settings } from './settings/settings';
import { withAuth } from './HOC/auth';
import { SimpleDifference } from './simpleDifference/simpleDifference';
import { NotFound } from './notFound/notFound';
import { useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme, Global } from '@mantine/core';

// const StyledApp = styled.div`
//   // Your style here
// `;

const AuthSettings = withAuth(Settings);
const AuthSimpleDifference = withAuth(SimpleDifference);
const AuthNotFound = withAuth(NotFound);

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, loader: 'bars' }}>
        <Global
          styles={(theme) => ({
            body: {
              height: '100%',
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            },
            height: '100%',
          })}
        />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Login />} />
          <Route path='/settings' element={<AuthSettings />} />
          <Route path='/simple-difference' element={<AuthSimpleDifference />} />
          <Route path='*' element={<AuthNotFound />} />
        </Routes>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
