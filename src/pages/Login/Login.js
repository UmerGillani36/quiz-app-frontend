import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import classes from './Login.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../../serverConfig';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // this function is used for login

  const handleSubmit = () => {
    if (email.trim().length > 0 && password.trim().length > 0) {
      axios({
        method: 'post',
        url: `${serverUrl}/admin/auth/login`,
        data: {
          email,
          password,
        },
      })
        .then((response) => {
          console.log('response', response?.data?.token);
          localStorage.setItem('token', response?.data?.token)
          clearState();
          toast.success('Successfully sign in.', {
            position: 'top-center',
            autoClose: 3000,
          });
          localStorage.setItem('authenticated', true);
          navigate('/dashboard');
        })
        .catch(() => {
          toast.error(
            '"Incorrect email address or password, please try again',
            {
              position: 'top-center',
              autoClose: 3000,
            }
          );
        });
    } else {
      toast.error('Please fill the fields.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };
  // This is for clearing the state
  const clearState = () => {
    setPassword('');
    setEmail('');
  };
  return (
    <Box className={classes.mainContainer}>
      <Box className={classes.mainContent}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box className={classes.fieldsWrapper}>
          <Typography sx={{ fontWeight: 'bold', margin: '10px 0px' }}>
            Email
          </Typography>
          <TextField
            testid='email'
            fullWidth
            name='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography sx={{ fontWeight: 'bold', margin: '10px 0px' }}>
            Password
          </Typography>
          <TextField
            fullWidth
            testid='password'
            name='password'
            placeholder='Enter Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSubmit} className={classes.action}>
            Sign In
          </button>
          <Grid container>
            <Grid item>
              <span
                className={classes.anchorText}
                onClick={() => navigate('/signup')}
              >
                {"Don't have an account? Sign Up"}
              </span>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
