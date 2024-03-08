import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../utils/redux/store';
import { clearUser } from '../utils/redux/userSlice';

import {
  Avatar, Box, Button, CircularProgress, Grid, Typography,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { googleLogout } from '../api/googleApi';
import FlowAlert from './FlowAlert';
import { Status } from '../types/Status';
import { useState } from 'react';

function AccountInfoGoogle() {
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clickLogout = () => {
    setStatus(Status.Loading);

    googleLogout()
      .then(() => {
        dispatch(clearUser());
        navigate('/');
        setStatus(null);
      })
      .catch(() => setStatus(Status.Error));
  };

  return (
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
        <AccountCircleIcon />
      </Avatar>

      <Typography component="h1" variant="h5">
        {'My Account'}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography component="h1" variant="h5">
              {'You have come in with Google'}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex' }}>
              <BadgeIcon sx={{ mr: 2, width: 30, height: 30 }} />

              <Typography component="h1" variant="h5">
                {user?.name || 'Name'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex' }}>
              <LocalPostOfficeIcon sx={{ mr: 2, width: 30, height: 30 }} />

              <Typography component="h1" variant="h5">
                {user?.email || 'Email'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Button
          disabled={status === Status.Loading}
          color="primary"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 8, mb: 2 }}
          onClick={clickLogout}
        >
          {status === Status.Loading ? (
            <CircularProgress color="primary" size={26} />
          ) : (
            'Logout'
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default AccountInfoGoogle;
