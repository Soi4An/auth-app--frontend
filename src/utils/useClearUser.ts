import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./redux/store";
import { clearUser } from "./redux/userSlice";

export const useClearUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clear = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return clear;
};
