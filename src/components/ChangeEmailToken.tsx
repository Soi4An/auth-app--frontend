import { Box, Button, TextField, Typography } from '@mui/material';

type Params = {
  confirmation: string;
  setConfirmation: (token: string) => void;
  stepIncrease: () => void;
  stepDecrease: () => void;
};

function ChangeEmailToken({
  confirmation,
  setConfirmation,
  stepIncrease,
  stepDecrease,
}: Params) {

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    stepIncrease();
  };

  return (
    <Box component="form" onSubmit={handlerSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        {'Insert confirmation code from your mail'}
      </Typography>

      <TextField
        required
        id="confirmation"
        name="confirmation"
        label="Confirmation"
        variant="standard"
        type="password"
        fullWidth
        autoFocus
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={stepDecrease} sx={{ mt: 3, ml: 1 }}>
          Back
        </Button>

        <Button variant="contained" type="submit" sx={{ mt: 3, ml: 1 }}>
          {'Change email'}
        </Button>
      </Box>
    </Box>
  );
}

export default ChangeEmailToken;
