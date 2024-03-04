import { Alert, AlertColor, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Params = {
  type: AlertColor;
  message: string;
  setClose: (p: boolean) => void;
};

function FlowAlert({ type, message, setClose }: Params) {
  return (
    <div hidden={!message} >
      <Alert
        severity={type}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setClose(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          mt: 1,
          width: "100%",
          maxWidth: 580,
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 2,
        }}
      >
        {message}
      </Alert>
    </div>
  );
}

export default FlowAlert;
