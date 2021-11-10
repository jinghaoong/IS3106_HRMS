import { StyledEngineProvider, ThemeProvider } from '@material-ui/core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  Navigate,
  useRoutes
} from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import GlobalStyles from './components/GlobalStyles';
import MainLayout from './components/MainLayout';
import { auth, db } from './firebase-config';
import Account from './pages/Account';
import Appraisal from './pages/Appraisal';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeListResults from './pages/EmployeeList';
import EmployeesPage from './pages/EmployeesPage';
import Leave from './pages/Leave';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Payroll from './pages/Payroll';
import QR from './pages/QR';
import UserAppraisal from './pages/UserAppraisal';
import UserAttendance from './pages/UserAttendance';
import UserPayroll from './pages/UserPayroll';
import theme from './theme';

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
  const employeesRef = collection(db, 'users');
  const leaveApplications = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      const data = await getDocs(employeesRef);
      setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getEmployees();
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
        { path: 'appraisal', element: (currUser !== null ? <Appraisal /> : <Login />) },
        { path: 'attendance', element: (currUser !== null ? (<Attendance />) : <Login />) },
        { path: 'leave', element: (currUser !== null ? <Leave leaveApplications={leaveApplications} /> : <Login />) },
        { path: 'userAppraisal', element: (currUser !== null ? <UserAppraisal /> : <Login />) },
        { path: 'userAttendance', element: (currUser !== null ? <UserAttendance /> : <Login />) },
        { path: '*', element: <Navigate to="/404" /> },
        { path: 'payroll', element: (currUser !== null ? <Payroll /> : <Login />) },
        { path: 'qr', element: (currUser !== null ? <QR /> : <Login />) },
        { path: 'userpayroll', element: <UserPayroll /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <EmployeeForm EmployeeForm={EmployeeForm} /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to={currUser === null ? '/login' : '/app/dashboard'} /> },
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
