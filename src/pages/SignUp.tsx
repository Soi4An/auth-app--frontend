import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { AlertMessageError, AlertMessageSuccess } from "../config";
import { validationErrors } from "../utils/validationErrors";
import FlowAlert from "../components/FlowAlert";
import { SignUpErrors, SignUpParams } from "../types/SignUp";

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
import { registrRequest } from "../api/authApi";
import { CircularProgress } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const DEF_SIGNUP_PARAMS = { email: "", name: "", password: "" };

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function validateSingUpParams(params: SignUpParams) {
  const { email, name, password } = params;

  const errEmail = validationErrors.email(email);
  const errName = validationErrors.name(name);
  const errPassword = validationErrors.password(password);

  if (!errEmail && !errName && !errPassword) {
    return null;
  }

  return {
    email: errEmail,
    name: errName,
    password: errPassword,
  };
}

export default function SignUp() {
  const [registerDate, setRegisterData] =
    useState<SignUpParams>(DEF_SIGNUP_PARAMS);
  const [validErrors, setValidErrors] = useState<SignUpErrors | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const errEmail = validErrors?.email || null;
  const errName = validErrors?.name || null;
  const errPassword = validErrors?.password || null;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRegisterData((curr) => ({ ...curr, [e.target.name]: e.target.value }));
    setValidErrors((curr) =>
      curr ? { ...curr, [e.target.name]: null } : null
    );
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateSingUpParams(registerDate);

    setValidErrors(errors);

    if (!errors) {
      setIsLoading(true);
      setIsError(false);
      setIsSuccess(false);

      registrRequest(registerDate)
        .then(() => {
          setRegisterData(DEF_SIGNUP_PARAMS);
          setIsSuccess(true);
        })
        .catch((err) => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  };

  const googleAuth = () => {
    const serverUrl = process.env.SERVER_DOMAIN || 'http://localhost:3005';

    window.open(`${serverUrl}/auth/google/callback`, '_self');
    // window.location.href = `${serverUrl}/auth/google`;
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

          <FlowAlert
            type={"success"}
            setClose={setIsSuccess}
            message={isSuccess && !isLoading ? AlertMessageSuccess : ""}
          />

          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            {"Sign up"}
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handlerSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  disabled={isLoading || isSuccess}
                  error={errEmail ? true : false}
                  id={errEmail ? "outlined-error" : "email"}
                  label={errEmail ? errEmail : "Email Address"}
                  name="email"
                  value={registerDate.email}
                  onChange={(e) => onChange(e)}
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  disabled={isLoading || isSuccess}
                  error={errName ? true : false}
                  id={errName ? "outlined-error" : "name"}
                  label={errName ? errName : "Name"}
                  name="name"
                  value={registerDate.name}
                  onChange={(e) => onChange(e)}
                  autoComplete="given-name"
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  disabled={isLoading || isSuccess}
                  error={errPassword ? true : false}
                  id={errPassword ? "outlined-error" : "password"}
                  label={errPassword ? errPassword : "Password"}
                  name="password"
                  type="password"
                  value={registerDate.password}
                  onChange={(e) => onChange(e)}
                  autoComplete="new-password"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>

            <Button
              disabled={isLoading || isSuccess}
              color={isSuccess ? "success" : "primary"}
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading && <CircularProgress color="primary" size={26} />}
              {isSuccess && "Check your email"}
              {!isLoading && !isSuccess && "Sign Up"}
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  variant="body2"
                  component={isLoading ? Typography : RouterLink}
                  to="/login"
                >
                  {"Already have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
          </Box>

          <Typography component="h1" variant="h6" sx={{ my: 2 }}>
            {"or"}
          </Typography>

          <Button
            onClick={googleAuth}
            disabled={isLoading || isSuccess}
            color="info"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            <GoogleIcon sx={{ mr: 2 }} />
            {"Sing up with Google"}
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
