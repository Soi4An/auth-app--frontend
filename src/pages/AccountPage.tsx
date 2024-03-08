import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { useAppSelector } from '../utils/redux/store';

import { Container, CssBaseline, createTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import AccountInfo from '../components/AccountInfo';
import AccountInfoGoogle from '../components/AccountInfoGoogle';

const defaultTheme = createTheme();

function AccountPage() {

  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />

        <IconButton
          color="secondary"
          onClick={() => navigate('/')}
          sx={{ mt: 1, position: 'absolute' }}
        >
          <HomeIcon />
        </IconButton>

        {user && user.googleId && (<AccountInfoGoogle />)}
        {user && !user.googleId && (<AccountInfo />)}
      </Container>
    </ThemeProvider>
  );
}

export default AccountPage;
