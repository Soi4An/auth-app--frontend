import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../utils/redux/store';
import { Status } from '../types/Status';
import { logout } from '../api/authApi';
import { clearUser } from '../utils/redux/userSlice';
import { accessTokenService } from '../utils/accessTokenService';
import FlowAlert from './FlowAlert';

import {
  Avatar, Box, Button, CircularProgress, Grid, Typography,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';

function AccountInfo() {
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clickLogout = () => {
    setStatus(Status.Loading);

    logout()
      .then(() => {
        dispatch(clearUser());
        accessTokenService.remove();
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
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex' }}>
              <BadgeIcon sx={{ width: 30, height: 30 }} />

              <Typography component="h1" variant="h5" sx={{ ml: 2 }}>
                {user?.name || 'Name'}
              </Typography>
            </Box>

            <Button
              color="info"
              variant="contained"
              size="small"
              onClick={() => navigate('change-name')}
            >
              {'Change'}
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex' }}>
              <LocalPostOfficeIcon sx={{ width: 30, height: 30 }} />

              <Typography component="h1" variant="h5" sx={{ ml: 2 }}>
                {user?.email || 'Email'}
              </Typography>
            </Box>

            <Button
              color="info"
              variant="contained"
              size="small"
              onClick={() => navigate('change-email')}
            >
              {'Change'}
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex' }}>
              <LockIcon sx={{ width: 30, height: 30 }} />

              <Typography component="h1" variant="h5" sx={{ ml: 2 }}>
                {'Password'}
              </Typography>
            </Box>

            <Button
              color="info"
              variant="contained"
              size="small"
              onClick={() => navigate('change-password')}
            >
              {'Change'}
            </Button>
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

export default AccountInfo;
