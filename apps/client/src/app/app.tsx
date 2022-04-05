import { Routes, Route } from 'react-router-dom';
// import styled from '@emotion/styled';
import { Main } from './main/main';
import { Login } from './login/login';
import { Settings } from './settings/settings';
import { withAuth } from './HOC/auth';
import { SimpleDifference } from './simpleDifference/simpleDifference';

// const StyledApp = styled.div`
//   // Your style here
// `;

const AuthSettings = withAuth(Settings);
const AuthSimpleDifference = withAuth(SimpleDifference);

export function App() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Login />} />
      <Route path='/settings' element={<AuthSettings />} />
      <Route path='/simple-difference' element={<AuthSimpleDifference />} />
    </Routes>
  );
}

export default App;
