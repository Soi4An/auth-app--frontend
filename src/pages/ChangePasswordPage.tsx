import { useState } from 'react';
import { changePassword } from '../api/userApi';
import { Link } from 'react-router-dom';
import { validateChangePasswordParams } from '../utils/validatations';
import { ChangeParamsError, ChangeParamsSuccess } from '../config';

import {
  ChangePasswordError,
  ChangePasswordParams,
} from '../types/ChangePassword';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress, TextField } from '@mui/material';
import { useClearUser } from '../utils/useClearUser';

const steps = ['Enter a new name'];
const DEF_PARAMS = { password: '', confirmation: '' };

export default function ChangePasswordPage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [passwordDate, setPasswordDate] =
    useState<ChangePasswordParams>(DEF_PARAMS);
  const [errorValidate, setErrorValidate] =
    useState<ChangePasswordError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const errPass = errorValidate?.password || null;
  const errCofig = errorValidate?.confirmation || null;

  const clearAll = useClearUser();

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

    const validate = validateChangePasswordParams(passwordDate);

    if (validate) {
      return setErrorValidate(validate);
    }

    setActiveStep(activeStep + 1);
    setIsLoading(true);
    setIsError(false);

    changePassword({
      oldPassword,
      newPassword: passwordDate.password,
      confirmation: passwordDate.confirmation,
    })
      .catch((err) =>
        err.response?.status === 401 ? clearAll() : setIsError(true)
      )
      .finally(() => setIsLoading(false));
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setIsLoading(false);
    setIsError(false);
  };

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Password change
          </Typography>

          {activeStep === 0 && (
            <Box component="form" onSubmit={handlerSubmit} noValidate>
              <Typography variant="h6" gutterBottom sx={{ mt: 6 }}>
                Enter the old password
              </Typography>

              <TextField
                required
                id="old password"
                name="oldPassword"
                label="Old password"
                variant="standard"
                type="password"
                autoComplete="current-password"
                fullWidth
                autoFocus
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <Typography variant="h6" gutterBottom sx={{ mt: 6 }}>
                Enter a new password
              </Typography>

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

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button component={Link} to="/profile" sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>

                <Button
                  variant="contained"
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {'Change password'}
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === steps.length && (
            <>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="primary" sx={{ mt: 3 }} />
                </Box>
              ) : (
                <>
                  <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
                    {isError ? 'Error' : 'Success'}
                  </Typography>
                  <Typography variant="subtitle1">
                    {isError ? ChangeParamsError : ChangeParamsSuccess('name')}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {!isError && (
                      <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Back
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      component={Link}
                      to="/profile"
                      sx={{ mt: 3, ml: 1 }}
                    >
                      {'Return to profile'}
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}
