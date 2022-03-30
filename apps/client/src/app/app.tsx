import { Routes, Route } from 'react-router-dom';
// import styled from '@emotion/styled';
import { Main } from './main/main';
import { Login } from './login/login';
import { Settings } from './settings/settings';
import { withAuth } from './HOC/auth';

// const StyledApp = styled.div`
//   // Your style here
// `;

const AuthSettings = withAuth(Settings);

export function App() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Login />} />
      <Route path='/settings' element={<AuthSettings />} />
    </Routes>
  );
}

export default App;
