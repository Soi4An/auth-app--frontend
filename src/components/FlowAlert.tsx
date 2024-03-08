import { Alert, AlertColor, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AlertMessageError, AlertMessageSuccess } from '../config';

type Params = {
  type: AlertColor | null;
  setClose: (p: null) => void;
  mess?: string;
};

function FlowAlert({ type, setClose }: Params) {
  return (
    <div hidden={!type} >
      <Alert
        severity={type || 'error'}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setClose(null)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          mt: 1,
          width: '100%',
          maxWidth: 580,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 2,
        }}
      >
        {type === 'error' && AlertMessageError}
        {type === 'success' && AlertMessageSuccess}
      </Alert>
    </div>
  );
}

export default FlowAlert;
