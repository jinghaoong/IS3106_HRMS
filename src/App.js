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
      element: (currUser !== null ? <DashboardLayout /> : ''),
      children: [
        { path: 'account', element: (currUser !== null ? <Account /> : <Login />) },
        { path: 'employees', element: (currUser !== null ? <EmployeeListResults employees={employees} /> : <Login />) },
        { path: 'createEmployee', element: (currUser !== null ? <EmployeeForm EmployeeForm={EmployeeForm} /> : <Login />) },
        { path: 'allEmployees', element: (currUser !== null ? <EmployeesPage EmployeesPage={EmployeesPage} /> : <Login />) },
        { path: 'dashboard', element: (currUser !== null ? <Dashboard /> : <Login />) },
        { path: 'appraisal', element: (currUser !== null ? <Appraisal appraisal={appraisal} employees={employees} appraisalForm={appraisalForm} /> : <Login />) },
        { path: 'attendance', element: (currUser !== null ? (<Attendance attendance={attendance} employees={employees} />) : <Login />) },
        { path: 'leave', element: (currUser !== null ? <Leave leaveApplications={leaveApplications} /> : <Login />) },
        { path: '*', element: <Navigate to="/404" /> },
        { path: 'payroll', element: (currUser !== null ? <Payroll /> : <Login />) },
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
