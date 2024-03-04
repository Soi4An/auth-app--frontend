import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/redux/store";
import { activationEmail } from "../api/userApi";
import { setUser } from "../utils/redux/userSlice";
import { ChangeParamsError, ChangeParamsSuccess } from "../config";

import ChangeEmailPass from "../components/ChangeEmailPass";
import ChangeEmailEmail from "../components/ChangeEmailEmail";
import ChangeEmailToken from "../components/ChangeEmailToken";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import { useClearUser } from "../utils/useClearUser";

const steps = ["Confirm password", "Enter new email", "Confirm new email"];

export default function ChangeEmailPage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [newEmail, setNewEmail] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const clearUser = useClearUser();

  const stepIncrease = useCallback(() => setActiveStep((curr) => curr + 1), []);
  const stepDecrease = useCallback(() => setActiveStep((curr) => curr - 1), []);

  useEffect(() => {
    if (activeStep === steps.length) {
      setIsLoading(true);
      setIsError(false);

      activationEmail({ activetionToken: confirmation, newEmail })
        .then(() => {
          if (user) {
            dispatch(setUser({ ...user, email: newEmail }));
          }
        })
        .catch((err) =>
          err.response?.status === 401 ? clearUser() : setIsError(true)
        )
        .finally(() => setIsLoading(false));
    }
  }, [activeStep]);

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Change Email
          </Typography>

          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && <ChangeEmailPass stepIncrease={stepIncrease} />}
          {activeStep === 1 && (
            <ChangeEmailEmail
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              stepIncrease={stepIncrease}
            />
          )}
          {activeStep === 2 && (
            <ChangeEmailToken
              confirmation={confirmation}
              setConfirmation={setConfirmation}
              stepIncrease={stepIncrease}
              stepDecrease={stepDecrease}
            />
          )}
          {activeStep === steps.length && (
            <>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress color="primary" sx={{ mt: 3 }} />
                </Box>
              ) : (
                <>
                  <Typography variant="h5" gutterBottom>
                    {isError ? "Error" : "Success"}
                  </Typography>
                  <Typography variant="subtitle1">
                    {isError ? ChangeParamsError : ChangeParamsSuccess("email")}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/profile"
                      sx={{ mt: 3, ml: 1 }}
                    >
                      {"Return to profile"}
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}
