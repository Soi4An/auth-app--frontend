import { useState } from 'react';
import { changeEmailRequest } from '../api/userApi';
import FlowAlert from './FlowAlert';

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { validationErrors } from '../utils/validationErrors';
import { useClearUser } from '../utils/useClearUser';
import { Status } from '../types/Status';

type Params = {
  newEmail: string;
  setNewEmail: (email: string) => void;
  stepIncrease: () => void;
};

function ChangeEmailEmail({ stepIncrease, newEmail, setNewEmail }: Params) {
  const [status, setStatus] = useState<Status | null>(null);
  const [validateErr, setValidateErr] = useState<string | null>(null);
  const clearAll = useClearUser();

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (validateErr) {
      setValidateErr(null);
    }

    setNewEmail(e.target.value);
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validate = validationErrors.email(newEmail);

    if (validate) {
      return setValidateErr(validate);
    }

    setStatus(Status.Loading);

    changeEmailRequest({ newEmail })
      .then(() => {
        stepIncrease();
        setStatus(null);
      })
      .catch((err) =>
        err.response?.status === 401 ? clearAll() : setStatus(Status.Error)
      );
  };

  return (
    <Box component="form" onSubmit={handlerSubmit} noValidate>
      <FlowAlert
        type={status === Status.Error ? status : null}
        setClose={setStatus}
      />

      <Typography variant="h6" gutterBottom>
        {'Enter a new email address'}
      </Typography>

      <TextField
        error={!!validateErr}
        required
        id={validateErr ? 'outlined-error' : 'email'}
        name="email"
        label={validateErr ? validateErr : 'New email'}
        variant="standard"
        fullWidth
        autoFocus
        autoComplete="email"
        value={newEmail}
        onChange={(e) => handlerChange(e)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          disabled={status === Status.Loading}
          variant="contained"
          type="submit"
          sx={{ mt: 3, ml: 1 }}
        >
          {status === Status.Loading ? (
            <CircularProgress color="primary" size={24} />
          ) : (
            'Next'
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default ChangeEmailEmail;
