import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';
import Logo from './Logo';

const user = JSON.parse(localStorage.getItem('currUser'));

const MainNavbar = (props) => (
  <AppBar
    elevation={0}
    {...props}
  >
    <Toolbar sx={{ height: 64 }}>
      <RouterLink to={user === null ? '/login' : '/'}>
        <Logo />
      </RouterLink>
    </Toolbar>
  </AppBar>
);

export default MainNavbar;
