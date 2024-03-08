import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { accessTokenService } from '../utils/accessTokenService';
import { useAppDispatch } from '../utils/redux/store';
import { setUserAndMethod } from '../utils/redux/userSlice';
import FlowAlert from '../components/FlowAlert';
import { login } from '../api/authApi';

import { SignInParams } from '../types/SignIn';
import { ActivateAccountResponse } from '../types/authApi';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import GoogleIcon from '@mui/icons-material/Google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import { Status } from '../types/Status';
import { LoginMethod } from '../types/LoginMethod';

const DEF_LOGIN_PARAMS = {
  email: '',
  password: '',
};

const defaultTheme = createTheme();

export default function SignIn() {
  const [loginDate, setLoginData] = useState<SignInParams>(DEF_LOGIN_PARAMS);
  const [status, setStatus] = useState<Status | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLoginData((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };

  const handlerSuccess = (res: ActivateAccountResponse) => {
    const { user, accessToken } = res;

    accessTokenService.save(accessToken);
    dispatch(setUserAndMethod({ user, method: LoginMethod.Def}));

    return navigate(location.state?.from?.pathname || '/profile');
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(Status.Loading);

    login(loginDate)
      .then((res) => {
        setStatus(null);
        handlerSuccess(res.data);
      })
      .catch(() => setStatus(Status.Error));
  };

  const googleAuth = () => {
    const serverUrl = process.env.SERVER_DOMAIN || 'http://localhost:3005';

    window.open(`${serverUrl}/auth/google/callback`, '_self');
    // window.location.href = `${serverUrl}/auth/google`;
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <IconButton
          color="secondary"
          onClick={() => navigate('/')}
          sx={{ mt: 1, position: 'absolute' }}
        >
          <HomeIcon />
        </IconButton>

        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <FlowAlert
            type={status === Status.Error ? status : null}
            setClose={setStatus}
          />

          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Box
            component="form"
            onSubmit={handlerSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={loginDate.email}
              onChange={(e) => handlerChange(e)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={loginDate.password}
              onChange={(e) => handlerChange(e)}
            />

            <Button
              disabled={status === Status.Loading}
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              {status === Status.Loading ? (
                <CircularProgress color="primary" size={26} />
              ) : (
                'Sign In'
              )}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot" variant="body2">
                  Forgot password?
                </Link>
              </Grid>

              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {'Don\'t have an account? Sign Up'}
                </Link>
              </Grid>
            </Grid>
          </Box>

          <Typography component="h1" variant="h6" sx={{ my: 2 }}>
            {'or'}
          </Typography>

          <Button
            onClick={googleAuth}
            disabled={status === Status.Loading || status === Status.Success}
            color="info"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            <GoogleIcon sx={{ mr: 2 }} />
            {'Sing in with Google'}
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
