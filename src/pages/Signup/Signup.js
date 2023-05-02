import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import classes from './Signup.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../serverConfig';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // This is for submitting the Signup form
  const handleSubmit = async () => {
    if (email.trim().length > 0 && password.trim().length > 0 && name.trim().length > 0) {
      axios({
        method: 'post',
        url: `${serverUrl}/admin/auth/register`,
        data: {
          email,
          password,
          name,
        }
      }).then((response) => {
        console.log('token', response?.data?.token);
        localStorage.setItem('token', response?.data?.token)
        clearState();
        toast.success('Successfully signup.', {
          position: 'top-center',
          autoClose: 3000,
        })
        navigate('/');
      }).catch(() => {
        toast.error('User already exist please try another email', {
          position: 'top-center',
          autoClose: 3000,
        })
      })
    } else {
      toast.error('Please fill the fields.', {
        position: 'top-center',
        autoClose: 3000,
      })
    }
  };
  // This is for clearing the state
  const clearState = () => {
    setName('');
    setPassword('');
    setEmail('')
  }
  return (
    <Box className={classes.mainContainer}>
      <Box
      className={classes.mainContent}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box className={classes.fieldsWrapper}>

          <Typography sx={{ fontWeight: 'bold', margin: '10px 0px' }}>Username</Typography>
          <TextField
            name="name"
            placeholder='Enter username'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Typography sx={{ fontWeight: 'bold', margin: '10px 0px' }}>Email</Typography>
          <TextField
            fullWidth
            name="email"
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography sx={{ fontWeight: 'bold', margin: '10px 0px' }}>Password</Typography>
          <TextField
            fullWidth
            name="password"
            placeholder='Enter password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
           <button
            onClick={handleSubmit}
            className={classes.action}
          >
            Sign Up
          </button>
          <Grid container>
            <Grid item>
              <span className={classes.anchorText} onClick={() => navigate('/')}>
                {'Already have an account? Sign in'}
              </span>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
