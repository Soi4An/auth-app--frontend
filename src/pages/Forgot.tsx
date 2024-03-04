import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CachedIcon from "@mui/icons-material/Cached";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CircularProgress, Grid, Link } from "@mui/material";
import FlowAlert from "../components/FlowAlert";
import { AlertMessageError, AlertMessageSuccess } from "../config";
import { forgot } from "../api/authApi";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function Forgot() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    forgot({ email })
      .then(() => {
        setEmail('');
        setIsSuccess(true);
      })
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
            message={(isError && !isLoading) ? AlertMessageError : ""}
          />

          <FlowAlert
            type={"success"}
            setClose={setIsSuccess}
            message={(isSuccess && !isLoading) ? AlertMessageSuccess : ""}
          />

          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <CachedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Password reset
          </Typography>

          <Box
            component="form"
            onSubmit={handlerSubmit}
            noValidate
            sx={{ mt: 4 }}
          >
            <Typography variant="body1">Enter your email address</Typography>

            <TextField
              disabled={isSuccess}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

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
              {!isLoading && !isSuccess && "Send confirmation"}
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  variant="body2"
                  component={isLoading ? Typography : RouterLink}
                  to="/login"
                >
                  {"Return to Sign in"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Forgot;
