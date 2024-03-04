import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { AlertTypes } from "../types/AlertTypes";

const defaultTheme = createTheme();

type SuccessLinkParams = {
  href: string;
  buttonTitle: string;
  message: string;
  type: AlertTypes;
};

function AlertWithLink({
  href,
  buttonTitle,
  message,
  type,
}: SuccessLinkParams) {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={defaultTheme}>
        <Alert
          severity={type}
          sx={{ py: 3, px: 6 }}
          action={
            <Button component={RouterLink} to={href} color="inherit">
              {buttonTitle}
            </Button>
          }
        >
          {message}
        </Alert>
      </ThemeProvider>
    </>
  );
}

export default AlertWithLink;
