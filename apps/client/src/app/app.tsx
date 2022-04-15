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
import { APP_THEMES, DEFAULT_APP_THEME, ROUTES, SESSION_STORAGE } from '@diploma-v2/common/constants-common';
import { getPreferredColorScheme } from '@diploma-v2/frontend/utils-frontend';
import { DeepAnalyze } from './deepAnalyze/deepAnalyze';

// const StyledApp = styled.div`
//   // Your style here
// `;

const AuthSettings = withAuth(Settings);
const AuthSimpleDifference = withAuth(SimpleDifference);
const AuthDeepAnalyze = withAuth(DeepAnalyze);
const AuthNotFound = withAuth(NotFound);

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    return sessionStorage.getItem(SESSION_STORAGE.APP_THEME) as ColorScheme
      || getPreferredColorScheme()
      || DEFAULT_APP_THEME;
  });
  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || (
      colorScheme === APP_THEMES.DARK ? APP_THEMES.LIGHT : APP_THEMES.DARK
    );
    sessionStorage.setItem(SESSION_STORAGE.APP_THEME, newColorScheme);
    setColorScheme(newColorScheme);
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, loader: 'bars' }}>
        <Global
          styles={(theme) => ({
            body: {
              height: '100%',
              backgroundColor: theme.colorScheme === APP_THEMES.DARK ? theme.colors.dark[8] : theme.colors.gray[0],
            },
            height: '100%',
          })}
        />
        <Routes>
          <Route path={ROUTES.ROOT} element={<Main />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Login />} />
          <Route path={ROUTES.SETTINGS} element={<AuthSettings />} />
          <Route path={ROUTES.SIMPLE_DIFF} element={<AuthSimpleDifference />} />
          <Route path={ROUTES.DEEP_ANALYZE} element={<AuthDeepAnalyze />} />
          <Route path={'*'} element={<AuthNotFound />} />
        </Routes>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
