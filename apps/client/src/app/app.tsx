import { Routes, Route } from 'react-router-dom';
import styled from '@emotion/styled';
import { Main } from './main/main';
import { Login } from './login/login';
import { Settings } from './settings/settings';

const StyledApp = styled.div`
  // Your style here
`;

// npm install dayjs @mantine/prism @mantine/notifications @mantine/modals @mantine/hooks @mantine/form @mantine/dropzone @mantine/dates @mantine/core
// npm install tabler-icons-react

export function App() {
  return (
    <StyledApp>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </StyledApp>
  );
}

export default App;
