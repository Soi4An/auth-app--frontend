import React, { ReactNode, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/redux/store";
import { clearUser } from "../utils/redux/userSlice";
import AlertWithLink from "../pages/AlertWithLink";
import { checkRefresh } from "../api/authApi";
import { AlertTypes } from "../types/AlertTypes";
import { Box, CircularProgress } from "@mui/material";

type Props = {
  children?: ReactNode;
};

export const RequireAuth: React.FC<Props> = ({ children }) => {
  const [isValidRefresh, setIsValidRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    checkRefresh()
      .then((res) => setIsValidRefresh(res.data.isValid))
      .catch((err) => setIsError(true))
      .finally(() => setIsLoading(false));
  // }, []);
  }, [location?.pathname]);

  if (isLoading) {
    return (
      <Box sx={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
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

  if (!user || !isValidRefresh) {
    if (user) {
      dispatch(clearUser());
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children || <Outlet />}</>;
};
