import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon, Grid as GridIcon, Star as StarIcon,
  User as UserIcon,
  Users as UsersIcon
} from 'react-feather';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  doc,
  getDoc
} from 'firebase/firestore';
import NavItem from './NavItem';
import { db, auth } from '../firebase-config';

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/employees',
    icon: UsersIcon,
    title: 'Employees'
  },
  {
    href: '/app/attendance',
    icon: ClockIcon,
    title: 'Attendance'
  },
  {
    href: '/app/leave',
    icon: CalendarIcon,
    title: 'Leave'
  },
  {
    href: '/app/payroll',
    icon: DollarSignIcon,
    title: 'Payroll'
  },
  {
    href: '/app/appraisal',
    icon: StarIcon,
    title: 'Appraisal'
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: 'Account'
  },
  {
    href: '/app/qr',
    icon: GridIcon,
    title: 'QR Generator'
  },
  {
    href: '/app/userPayroll',
    icon: DollarSignIcon,
    title: 'User Payroll'
  },
  {
    href: '/404',
    icon: AlertCircleIcon,
    title: 'Error'
  }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const currUser = auth.currentUser;

  const [currEmp, setCurrEmp] = useState('');

  const currEmployee = async () => {
    await getDoc(doc(db, 'users', (auth.currentUser).email)).then((docSnap) => {
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        setCurrEmp(docSnap.data());
        console.log('Current employee is ', currEmp);
      } else {
        console.log('No such document!');
      }
    });
  };

  const user = {
    avatar: '/static/images/avatars/avatar_6.png',
    jobTitle: currEmp ? currEmp.role : 'Employee',
    name: currUser ? `${currEmp.firstName} ${currEmp.lastName}` : 'User',
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    currEmployee();
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Avatar
          component={RouterLink}
          src={user.avatar}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64
          }}
          to="/app/account"
        />
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography>
        <Typography
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          backgroundColor: 'background.default',
          m: 2,
          p: 2
        }}
      >
        <Typography
          align="center"
          gutterBottom
          variant="body2"
        >
          Need more?
        </Typography>
        <Typography
          align="center"
          variant="body2"
        >
          Upgrade to PRO version and access 20 more screens
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          <Button
            color="primary"
            component="a"
            href="https://react-material-kit.devias.io"
            variant="contained"
          >
            See PRO version
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden xlDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {
  },
  openMobile: false
};

export default DashboardSidebar;
