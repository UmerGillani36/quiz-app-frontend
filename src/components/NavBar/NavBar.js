import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import classes from './NavBar.module.css'
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { serverUrl } from '../../serverConfig';
import axios from 'axios';
const NavBar = () => {
  // For token
  const token = localStorage.getItem('token')
  const navigate = useNavigate();
  // This function is for logout
  const handleLogout = () => {
    axios({
      method: 'post',
      url: `${serverUrl}/admin/auth/logout`,
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    })
      .then(() => {
        localStorage.setItem('token', '')
        localStorage.setItem('authenticated', false)
        toast.success('Successfully logout.', {
          position: 'top-center',
          autoClose: 3000,
        });
        navigate('/');
      })
      .catch(() => {
        toast.error(
          'Something went Wrong!! please try again',
          {
            position: 'top-center',
            autoClose: 3000,
          }
        );
      });
  }
  return (
    <div className={classes.navbar}>
        <div className={classes.leftWrapper}>
            <div className={classes.logoWrapper}>
                <span className={classes.logo}>BigBrain</span>
            </div>
        </div>
        <div className={classes.actionWrapper} onClick={handleLogout}>
            <LogoutIcon sx={{ color: 'white', marginRight: '4px' }}/>
        <NavLink to="/" className={classes.action} >
            Logout
        </NavLink>
    </div>

    </div>
  )
}

export default NavBar
