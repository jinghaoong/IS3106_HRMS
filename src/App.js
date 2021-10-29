import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  Navigate,
  useRoutes
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@material-ui/core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase-config';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';

import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import EmployeeListResults from './pages/EmployeeList';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeForm from './pages/EmployeeForm';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProductList from './pages/ProductList';
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

  const [attendance, setAttendance] = useState([]);
  const attendanceRef = collection(db, 'attendance');
  const [employees, setEmployees] = useState([]);
  const employeesRef = collection(db, 'users');
  const [appraisal, setAppraisal] = useState([]);
  const appraisalRef = collection(db, 'appraisals');
  const [appraisalForm, setAppraisalForm] = useState([]);
  const appraisalFormRef = collection(db, 'appraisalForm');
  const leaveApplications = useState([]);

  useEffect(() => {
    const getAttendance = async () => {
      const data = await getDocs(attendanceRef);
      setAttendance(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getEmployees = async () => {
      const data = await getDocs(employeesRef);
      setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getAppraisal = async () => {
      const data = await getDocs(appraisalRef);
      setAppraisal(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getAppraisalForm = async () => {
      const data = await getDocs(appraisalFormRef);
      setAppraisalForm(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getAttendance();
    getEmployees();
    getAppraisal();
    getAppraisalForm();
  }, []);

  const content = useRoutes([
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: 'account', element: <Account /> },
        { path: 'employees', element: <EmployeeListResults employees={employees} /> },
        { path: 'createEmployee', element: <EmployeeForm EmployeeForm={EmployeeForm} /> },
        { path: 'allEmployees', element: <EmployeesPage EmployeesPage={EmployeesPage} /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'products', element: <ProductList /> },
        { path: 'settings', element: <Settings /> },
        { path: 'appraisal', element: <Appraisal appraisal={appraisal} employees={employees} appraisalForm={appraisalForm} /> },
        { path: 'attendance', element: <Attendance attendance={attendance} employees={employees} /> },
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
        { path: 'register', element: <EmployeeForm EmployeeForm={EmployeeForm} /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
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
