import { useCallback, useEffect, useState } from 'react';
import { Alert, CircularProgress } from '@mui/material';
import { registrActivate } from '../api/authApi';
import { useNavigate, useParams } from 'react-router-dom';
import { ActivateAccountResponse } from '../types/authApi';
import { accessTokenService } from '../utils/accessTokenService';
import { useAppDispatch } from '../utils/redux/store';
import { setUserAndMethod } from '../utils/redux/userSlice';
import { AlertMessageError } from '../config';
import { LoginMethod } from '../types/LoginMethod';

type Params = {
  requestWay: string;
};

const messageSuccess = 'Activation was successfull';

function SignUpActivation({ requestWay }: Params) {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activetionToken } = useParams();

  const handlerSuccess = useCallback(
    (res: ActivateAccountResponse) => {
      const { user, accessToken } = res;

      accessTokenService.save(accessToken);
      dispatch(setUserAndMethod({ user, method: LoginMethod.Def}));

      return navigate('/profile');
    },
    [dispatch, navigate]
  );

  useEffect(() => {
    if (activetionToken) {
      setError('');
      setIsLoading(true);

      registrActivate(requestWay, activetionToken)
        .then(res => handlerSuccess(res.data))
        .catch((err) => setError(err?.data?.message || AlertMessageError))
        .finally(() => setIsLoading(false));
    }
  }, [requestWay, activetionToken, handlerSuccess]);

  return (
    <>
      <h1>Activation Page</h1>

      {isLoading && !error && <CircularProgress color="primary" />}
      {!isLoading && error && (
        <Alert severity={error ? 'error' : 'success'} sx={{ mt: 1 }}>
          {error ? error : messageSuccess}
        </Alert>
      )}
    </>
  );
}

export default SignUpActivation;
