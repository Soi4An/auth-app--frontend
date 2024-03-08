import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CachedIcon from '@mui/icons-material/Cached';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import {
  ChangePasswordError,
  ChangePasswordParams,
} from '../types/ChangePassword';
import { validateChangePasswordParams } from '../utils/validatations';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Grid, Link } from '@mui/material';
import FlowAlert from '../components/FlowAlert';
import { forgotActivate } from '../api/authApi';
import { Status } from '../types/Status';

const defaultTheme = createTheme();
const DEF_PARAMS = { password: '', confirmation: '' };

type Params = {
  requestWay: string;
};

function ForgotActivation({ requestWay }: Params) {
  const [passwordDate, setPasswordDate] =
    useState<ChangePasswordParams>(DEF_PARAMS);
  const [errorValidate, setErrorValidate] =
    useState<ChangePasswordError | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const navigate = useNavigate();
  const { activetionToken } = useParams();

  const errPass = errorValidate?.password || null;
  const errCofig = errorValidate?.confirmation || null;

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (errorValidate) {
      setErrorValidate({ ...errorValidate, [e.target.name]: null });
    }

    setPasswordDate((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validateErrors = validateChangePasswordParams(passwordDate);

    if (validateErrors) {
      return setErrorValidate(validateErrors);
    }

    if (activetionToken) {
      setStatus(Status.Loading);

      const requestData = {
        way: requestWay,
        token: activetionToken,
        ...passwordDate,
      };

      forgotActivate(requestData)
        .then(() => {
          setStatus(null);
          navigate('/success-reset');
        })
        .catch(() => setStatus(Status.Error));
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
            <CachedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Password reset
          </Typography>

          <Box
            component="form"
            onSubmit={handlerSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              error={!!errPass}
              required
              id={errPass ? 'outlined-error' : 'password'}
              name="password"
              label={errPass ? errPass : 'New password'}
              variant="standard"
              type="password"
              autoComplete="new-password"
              fullWidth
              value={passwordDate.password}
              onChange={(e) => handlerChange(e)}
              sx={{ mb: 3 }}
            />

            <TextField
              error={!!errCofig}
              required
              id={errCofig ? 'outlined-error' : 'confirmation'}
              name="confirmation"
              label={errCofig ? errCofig : 'Confirmation'}
              variant="standard"
              type="password"
              autoComplete="new-password"
              fullWidth
              value={passwordDate.confirmation}
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
                'Change password'
              )}
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  variant="body2"
                  component={
                    status === Status.Loading ? Typography : RouterLink
                  }
                  to="/login"
                >
                  {'Return to Sign in'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default ForgotActivation;
