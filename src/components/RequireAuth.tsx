import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/redux/store';
import { setUserAndMethod } from '../utils/redux/userSlice';
import AlertWithLink from '../pages/AlertWithLink';
import { AlertTypes } from '../types/AlertTypes';
import { Box, CircularProgress } from '@mui/material';
import { googleGetUser } from '../api/googleApi';
import { LoginMethod } from '../types/LoginMethod';

type Props = {
  children?: ReactNode;
};

export const RequireAuth: React.FC<Props> = ({ children }) => {
  const { user, method } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const loginMethod = queryParams.get('loginMethod');

  // implement url without params after google enter
  // const getRedirectLocation = () => {
  //   const path = location.pathname;

  //   console.log(loginMethod);

  //   if (loginMethod) {
  //     const paramsIndex = path.indexOf('?');

  //     return {
  //       ...location,
  //       pathname: path.slice(0, paramsIndex),
  //     };
  //   }

  //   return location;
  // };

  const getGoogleUser = useCallback(() => {
    setIsLoading(true);
    setIsError(false);

    googleGetUser()
      .then((res) =>
        dispatch(
          setUserAndMethod({
            user: res.data.user,
            method: LoginMethod.Google,
          })
        )
      )
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user && !method && loginMethod === LoginMethod.Google) {
      getGoogleUser();
    }
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  }

  if (isError) {
    return (
      <AlertWithLink
        href="/"
        buttonTitle="Go to Home"
        message="The server is not responding. Please try again later."
        type={AlertTypes.error}
      />
    );
  }

  if (!user && !method && !loginMethod) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  return <>{children || <Outlet />}</>;
};
