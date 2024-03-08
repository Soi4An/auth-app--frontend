import { useState } from 'react';
import { confirmPassword } from '../api/userApi';
import FlowAlert from './FlowAlert';
import { Link } from 'react-router-dom';

import {
  Box,
  Button,
  CircularProgress,
  Input,
  TextField,
  Typography,
} from '@mui/material';
import { useClearUser } from '../utils/useClearUser';
import { useAppSelector } from '../utils/redux/store';
import { Status } from '../types/Status';

type Params = {
  stepIncrease: () => void;
};

function ChangeEmailPass({ stepIncrease }: Params) {
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useAppSelector((state) => state.user);
  const clearAll = useClearUser();

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus(Status.Loading);

    confirmPassword({ password })
      .then(() => {
        stepIncrease();
        setStatus(null);
      })
      .catch((err) => err.response?.status === 401
        ? clearAll()
        : setStatus(Status.Error)
      );
  };

  return (
    <Box component="form" onSubmit={handlerSubmit} noValidate>
      <FlowAlert
        type={status === Status.Error ? status : null}
        setClose={setStatus}
      />

      <Typography variant="h6" gutterBottom>
        {'Confirm password of your account'}
      </Typography>

      <Input
        type="text"
        name="email"
        value={user?.email}
        autoComplete="username"
        sx={{ display: 'none' }}
      />

      <TextField
        required
        id="password"
        name="password"
        label="Your password"
        variant="standard"
        type="password"
        fullWidth
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          disabled={status === Status.Loading}
          component={Link}
          to="/profile"
          sx={{ mt: 3, ml: 1 }}
        >
          Back
        </Button>

        <Button
          disabled={status === Status.Loading}
          variant="contained"
          size="medium"
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

export default ChangeEmailPass;
