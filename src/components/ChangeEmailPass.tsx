import { useState } from "react";
import { AlertMessageError } from "../config";
import { confirmPassword } from "../api/userApi";
import FlowAlert from "./FlowAlert";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useClearUser } from "../utils/useClearUser";
import { useAppSelector } from "../utils/redux/store";

type Params = {
  stepIncrease: () => void;
};

function ChangeEmailPass({ stepIncrease }: Params) {
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const clearUser = useClearUser();
  const { user } = useAppSelector((state) => state.user);

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setIsError(false);

    confirmPassword({ password })
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
        {"Confirm password of your account"}
      </Typography>

      <Input
        type="text"
        name="email"
        value={user?.email}
        autoComplete="username"
        sx={{ display: "none" }}
      />

      <TextField
        required
        id="password"
        name="password"
        label="Your password"
        variant="standard"
        type="password"
        fullWidth
        autoFocus
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          disabled={isLoading}
          component={Link}
          to="/profile"
          sx={{ mt: 3, ml: 1 }}
        >
          Back
        </Button>

        <Button
          disabled={isLoading}
          variant="contained"
          size="medium"
          type="submit"
          // onClick={handleNext}
          sx={{ mt: 3, ml: 1 }}
        >
          {isLoading ? <CircularProgress color="primary" size={24} /> : "Next"}
        </Button>
      </Box>
    </Box>
  );
}

export default ChangeEmailPass;
