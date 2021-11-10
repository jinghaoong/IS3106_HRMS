import { StyledEngineProvider, ThemeProvider } from '@material-ui/core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  Navigate,
  useRoutes
} from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import GlobalStyles from './components/GlobalStyles';
import MainLayout from './components/MainLayout';
import { auth } from './firebase-config';
import Account from './pages/Account';
import Appraisal from './pages/Appraisal';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import EmployeesPage from './pages/EmployeesPage';
import LeavePage from './pages/LeavePage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Payroll from './pages/Payroll';
import QR from './pages/QR';
import UserAppraisal from './pages/UserAppraisal';
import UserAttendance from './pages/UserAttendance';
import UserPayroll from './pages/UserPayroll';
import theme from './theme';

const App = () => {
  const [currUser, setCurrUser] = useState(auth.currentUser);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('logged in as', currUser);
      setCurrUser(auth.currentUser);
    } else {
      console.log('No logged in user');
    }
  });

  const content = useRoutes([
    {
      path: 'app',
      element: (currUser !== null ? <DashboardLayout /> : ''),
      children: [
        { path: 'account', element: (currUser !== null ? <Account /> : <Login />) },
        { path: 'employees', element: (currUser !== null ? <EmployeesPage /> : <Login />) },
        { path: 'dashboard', element: (currUser !== null ? <Dashboard /> : <Login />) },
        { path: 'appraisal', element: (currUser !== null ? <Appraisal /> : <Login />) },
        { path: 'attendance', element: (currUser !== null ? (<Attendance />) : <Login />) },
        { path: 'leave', element: <LeavePage /> },
        { path: 'payroll', element: (currUser !== null ? <Payroll /> : <Login />) },
        { path: 'qr', element: (currUser !== null ? <QR /> : <Login />) },
        { path: 'userAppraisal', element: (currUser !== null ? <UserAppraisal /> : <Login />) },
        { path: 'userAttendance', element: (currUser !== null ? <UserAttendance /> : <Login />) },
        { path: 'userpayroll', element: <UserPayroll /> },
        { path: '*', element: <Navigate to="/404" /> },
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '/', element: <Navigate to={currUser === null ? '/login' : '/app/dashboard'} /> },
        { path: 'login', element: <Login /> },
        // { path: 'register', element: <EmployeeForm EmployeeForm={EmployeeForm} /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ]
    }
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          {content}
        </ThemeProvider>
      </StyledEngineProvider>
    </LocalizationProvider>
  );
};

export default App;
