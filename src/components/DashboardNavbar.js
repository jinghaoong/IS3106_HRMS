import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { signOut } from 'firebase/auth';
import Logo from './Logo';
import { auth } from '../firebase-config';

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const currUser = JSON.parse(localStorage.getItem('currUser'));
  const [notifications] = useState([]);
  const navigate = useNavigate();

  return (
    <AppBar
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to={currUser !== null ? '/app/dashboard' : '/login'}>
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden xlDown>
          <IconButton color="inherit" size="large">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            size="large"
            title="Sign Out"
            onClick={() => {
              signOut(auth).then(() => {
                localStorage.removeItem('currUser');
                console.log('Signed out');
                console.log(localStorage.getItem('currUser'));
                navigate('/login', { replace: false });
              }).catch((error) => {
                console.log(error.message);
              });
            }}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen} size="large">
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
