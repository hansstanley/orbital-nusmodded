import {
  Button,
  Dialog,
  Typography,
  Card,
  TextField,
  Stack,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services";

export default function LoginDialog({ open, handleClose }) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    // await supabase.auth.signIn({
    //     email: "",
    //     password: "",
    // });
    handleClose();
    navigate("/");
  };

  return (
    <Dialog open={open} handleClose={handleClose}>
      <Card sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 0,
                width: 'fit-content',
                padding: 4,
                paddingBottom: 10,
                paddingTop: 8,
              }}>
        <Stack spacing = {2}>
          <Box>
            <Typography align="center" variant="h3" paddingLeft={2} paddingRight={2} color="primary">
              NUSMODDED
            </Typography>
            <Typography align="center" variant="h5" paddingLeft={2} paddingRight={2} paddingBottom={2}>
              Login
            </Typography>
          </Box>
          <Stack></Stack><Stack></Stack>
          <TextField
            label="Email"
            defaultValue=""
            size="small"
            required
          />
          <Stack>
          <TextField
            type="password"
            label="Password"
            defaultValue=""
            size="small"
            required
          />
          <Link>
            <Typography variant="caption" paddingLeft = {0.2}>
              Forget Password?
            </Typography>
          </Link>
          </Stack>
          <Stack></Stack>
          <Stack direction = "row" spacing = {2} justifyContent="space-evenly">
            <Button variant="contained" autoFocus onClick={handleLogin} size = 'large'>
              Login
            </Button>
            <Button variant="outlined" onClick={handleClose} size = 'large'>
              Cancel
            </Button>
          </Stack>
          <Stack></Stack>
        </Stack>
      </Card>
    </Dialog>
  );
}
