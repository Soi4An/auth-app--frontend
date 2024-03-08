import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CachedIcon from '@mui/icons-material/Cached';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Grid, Link } from '@mui/material';
import FlowAlert from '../components/FlowAlert';
import { forgot } from '../api/authApi';
import { Status } from '../types/Status';

const defaultTheme = createTheme();

function Forgot() {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<Status | null>(null);

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus(Status.Loading);

    forgot({ email })
      .then(() => {
        setEmail('');
        setStatus(Status.Success);
      })
      .catch(() => setStatus(Status.Error));
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
            type={status === Status.Loading ? null : status}
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
            sx={{ mt: 4 }}
          >
            <Typography variant="body1">Enter your email address</Typography>

            <TextField
              disabled={status === Status.Success}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              disabled={status === Status.Loading || status === Status.Success}
              color="primary"
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              {status === Status.Loading && (
                <CircularProgress color="primary" size={26} />
              )}
              {status === Status.Success && 'Check your email'}
              {(status === Status.Error || status === null) &&
                'Send confirmation'}
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

export default Forgot;
