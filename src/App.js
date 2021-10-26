import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  Navigate,
  useRoutes
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@material-ui/core';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase-config';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';

import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import EmployeeList from './pages/EmployeeList';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Appraisal from './pages/Appraisal';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';

const App = () => {
  const [currUser, setCurrUser] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
    } else {
      setCurrUser(null);
    }
  });

  const [employees, setEmployees] = useState([]);
  const employeeRef = collection(db, 'users');
  const leaveApplications = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      const data = await getDocs(employeeRef);
      setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getEmployees();
  }, []);

  /*
  const [payroll, setPayroll] = useState([]);
  const payrollRef = collection(db, 'payroll');

  useEffect(() => {
    const getPayroll = async () => {
      const data = await getDocs(payrollRef);
      setPayroll(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPayroll();
  }, []);
  */

  const content = useRoutes([
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: 'account', element: <Account /> },
        { path: 'employees', element: <EmployeeList employees={employees} /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'products', element: <ProductList /> },
        { path: 'settings', element: <Settings /> },
        { path: 'appraisal', element: <Appraisal /> },
        { path: 'attendance', element: <Attendance employees={employees} /> },
        { path: 'leave', element: <Leave leaveApplications={leaveApplications} /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: 'payroll', element: <Payroll /> },
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> },
      ]
    }
  ]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {content}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
