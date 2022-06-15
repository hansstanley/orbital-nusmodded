import * as React from 'react';
import {
  Avatar, 
  Button,
  TextField,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { supabase } from "../../services";


export default function SignUp(props) {
  const {activeStep, setActiveStep} = props;
  const [validateInput, setValidateInput] = React.useState("");
  const emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordCheck = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (emailCheck.test(data.get('email'))) {
      if (data.get('password') === data.get('confirmPassword')) {
        if (passwordCheck.test(data.get('password'))) {
          const { user, session, error } = await supabase.auth.signUp({
            email: data.get('email'),
            password: data.get('password'),
          },
          {
            data: { 
              username: data.get('username'),
            }
          });
          console.log("successfully signed up!");
          setActiveStep(activeStep + 1);
        } else if (data.get('password').length < 8) {
          setValidateInput("Password is too short! (minimum 8 characters)");
        } else if (data.get('password').toLowerCase() === data.get('password')){
          setValidateInput("Password does not contain at least one uppercase letter");
        } else if (data.get('password').toUpperCase() === data.get('password')){
          setValidateInput("Password does not contain at least one lowercase letter");
        } else{
          setValidateInput("Password does not contain at least one number");
        }
      } else {
        setValidateInput("Password does not match!");
      }
    }
    else {
      setValidateInput("Email entered is invalid!");
      console.log("xxx");
    }
  };

  return (
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            {
              !(validateInput === "") ? (
                <Typography color = "primary.light">{validateInput}</Typography>
              ) : (<></>)
            }
            <Grid container justifyContent="flex-end">
              <Grid item>
              </Grid>
            </Grid>
          </Box>
        </Box>
  );
}