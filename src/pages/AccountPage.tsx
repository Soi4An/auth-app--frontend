import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { useAppDispatch, useAppSelector } from "../utils/redux/store";
import { clearUser } from "../utils/redux/userSlice";
import { accessTokenService } from "../utils/accessTokenService";
import { logout } from "../api/authApi";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  createTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import BadgeIcon from "@mui/icons-material/Badge";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import HomeIcon from "@mui/icons-material/Home";
import FlowAlert from "../components/FlowAlert";

const messageError = "Something went wrong...";
const defaultTheme = createTheme();

function AccountPage() {
  const [waiting, setWaiting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clickLogout = () => {
    setWaiting(true);
    setIsError(false);

    logout()
      .then(() => {
        dispatch(clearUser());
        accessTokenService.remove();
        navigate("/login");
      })
      .catch((err) => setIsError(true))
      .finally(() => setWaiting(false));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={() => navigate("/")}
          sx={{ mt: 1, position: "absolute"}}
        >
          <ArrowBackIosIcon />
          <HomeIcon />
        </Button>

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
            message={isError && !waiting ? messageError : ""}
          />

          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AccountCircleIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            My Account
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex" }}>
                  <BadgeIcon sx={{ width: 30, height: 30 }} />

                  <Typography component="h1" variant="h5" sx={{ ml: 2 }}>
                    {user?.name || "Name"}
                  </Typography>
                </Box>

                <Button
                  color="info"
                  variant="contained"
                  size="small"
                  onClick={() => navigate("change-name")}
                >
                  {"Change"}
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex" }}>
                  <LocalPostOfficeIcon sx={{ width: 30, height: 30 }} />

                  <Typography component="h1" variant="h5" sx={{ ml: 2 }}>
                    {user?.email || "Email"}
                  </Typography>
                </Box>

                <Button
                  color="info"
                  variant="contained"
                  size="small"
                  onClick={() => navigate("change-email")}
                >
                  {"Change"}
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ display: "flex" }}>
                  <LockIcon sx={{ width: 30, height: 30 }} />

                  <Typography component="h1" variant="h5" sx={{ ml: 2 }}>
                    {"Password"}
                  </Typography>
                </Box>

                <Button
                  color="info"
                  variant="contained"
                  size="small"
                  onClick={() => navigate("change-password")}
                >
                  {"Change"}
                </Button>
              </Grid>
            </Grid>

            <Button
              disabled={waiting}
              color="primary"
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 8, mb: 2 }}
              onClick={clickLogout}
            >
              {waiting ? (
                <CircularProgress color="primary" size={26} />
              ) : (
                "Logout"
              )}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AccountPage;
