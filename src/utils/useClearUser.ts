import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './redux/store';
import { clearAll } from './redux/userSlice';

export const useClearUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clear = () => {
    dispatch(clearAll());
    navigate('/login');
  };

  return clear;
};
