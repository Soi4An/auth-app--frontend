import { useState } from 'react';
import { setUser } from '../utils/redux/userSlice';
import { useAppDispatch, useAppSelector } from '../utils/redux/store';
import { validationErrors } from '../utils/validationErrors';
import { changeName } from '../api/userApi';
import { Link } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CircularProgress, TextField } from '@mui/material';
import { ChangeParamsError, ChangeParamsSuccess } from '../config';
import { useClearUser } from '../utils/useClearUser';

const steps = ['Enter a new name'];

export default function ChangeNamePage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorValidate, setErrorValidate] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const clearAll = useClearUser();

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (errorValidate) {
      setErrorValidate(null);
    }

    setName(e.target.value.trimStart());
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validate = validationErrors.name(name);

    if (validate) {
      return setErrorValidate(validate);
    }

    const trimedName = name.trim();

    if (trimedName !== name) {
      setName(trimedName);
    }

    setActiveStep(activeStep + 1);
    setIsLoading(true);
    setIsError(false);

    changeName({ name: trimedName })
      .then(() => {
        if (user) {
          dispatch(setUser({ ...user, name }));
        }
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
            Name change
          </Typography>

          {activeStep === 0 && (
            <Box component="form" onSubmit={handlerSubmit} noValidate>
              <Typography variant="h6" gutterBottom sx={{ mt: 6 }}>
                Enter a new name
              </Typography>

              <TextField
                error={!!errorValidate}
                required
                id={errorValidate ? 'outlined-error' : 'new name'}
                name="name"
                label={errorValidate ? errorValidate : 'New name'}
                autoComplete="family-name"
                variant="standard"
                fullWidth
                autoFocus
                value={name}
                onChange={(e) => handlerChange(e)}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button component={Link} to="/profile" sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>

                <Button variant="contained" type="submit" sx={{ mt: 3, ml: 1 }}>
                  {'Change name'}
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
