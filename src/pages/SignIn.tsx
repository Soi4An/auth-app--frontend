import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { accessTokenService } from "../utils/accessTokenService";
import { useAppDispatch } from "../utils/redux/store";
import { setUser } from "../utils/redux/userSlice";
import FlowAlert from "../components/FlowAlert";
import { AlertMessageError } from "../config";

import { SignInParams } from "../types/SignIn";
import { ActivateAccountResponse } from "../types/authApi";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import { login } from "../api/authApi";

const DEF_LOGIN_PARAMS = {
  email: "",
  password: "",
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {
  const [loginDate, setLoginData] = useState<SignInParams>(DEF_LOGIN_PARAMS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLoginData((curr) => ({ ...curr, [e.target.name]: e.target.value }));
  };

  const handlerSuccess = (res: ActivateAccountResponse) => {
    const { user, accessToken } = res;

    accessTokenService.save(accessToken);
    dispatch(setUser(user));

    return navigate(location.state?.from?.pathname || "/profile");
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(false);
    setIsError(false);

    login(loginDate)
      .then((res) => handlerSuccess(res.data))
      .catch((err) => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FlowAlert
            type={"error"}
            setClose={setIsError}
            message={isError && !isLoading ? AlertMessageError : ""}
          />

          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <Box
            component="form"
            onSubmit={handlerSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={loginDate.email}
              onChange={(e) => handlerChange(e)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={loginDate.password}
              onChange={(e) => handlerChange(e)}
            />

            <Button
              disabled={isLoading}
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? (
                <CircularProgress color="primary" size={26} />
              ) : (
                "Sign In"
              )}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/forgot" variant="body2">
                  Forgot password?
                </Link>
              </Grid>

              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
