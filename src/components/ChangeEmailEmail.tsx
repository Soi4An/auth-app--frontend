import { useState } from "react";
import { AlertMessageError } from "../config";
import { changeEmailRequest } from "../api/userApi";
import FlowAlert from "./FlowAlert";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { validationErrors } from "../utils/validationErrors";
import { useClearUser } from "../utils/useClearUser";

type Params = {
  newEmail: string;
  setNewEmail: (email: string) => void;
  stepIncrease: () => void;
};

function ChangeEmailEmail({ stepIncrease, newEmail, setNewEmail }: Params) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [validateErr, setValidateErr] = useState<string | null>(null);
  const clearUser = useClearUser();

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (validateErr) {
      setValidateErr(null);
    }

    setNewEmail(e.target.value);
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validate = validationErrors.email(newEmail);

    if (validate) {
      return setValidateErr(validate);
    }

    setIsLoading(true);
    setIsError(false);

    changeEmailRequest({ newEmail })
      .then(stepIncrease)
      .catch((err) =>
        err.response?.status === 401 ? clearUser() : setIsError(true)
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <Box component="form" onSubmit={handlerSubmit} noValidate>
      <FlowAlert
        type={"error"}
        setClose={setIsError}
        message={isError && !isLoading ? AlertMessageError : ""}
      />

      <Typography variant="h6" gutterBottom>
        {"Enter a new email address"}
      </Typography>

      <TextField
        error={!!validateErr}
        required
        id={validateErr ? "outlined-error" : "email"}
        name="email"
        label={validateErr ? validateErr : "New email"}
        variant="standard"
        fullWidth
        autoFocus
        autoComplete="email"
        value={newEmail}
        onChange={(e) => handlerChange(e)}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          disabled={isLoading}
          variant="contained"
          type="submit"
          sx={{ mt: 3, ml: 1 }}
        >
          {isLoading ? <CircularProgress color="primary" size={24} /> : "Next"}
        </Button>
      </Box>
    </Box>
  );
}

export default ChangeEmailEmail;
