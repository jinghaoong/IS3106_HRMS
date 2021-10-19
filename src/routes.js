import { Navigate } from 'react-router-dom';
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
<<<<<<< HEAD
import Attendance from './pages/Attendance';
import Appraisal from './pages/Appraisal';
=======
>>>>>>> 09696dd731b594f522cba6f334b328f91173ac73

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'employees', element: <EmployeeList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
<<<<<<< HEAD
      { path: 'attendance', element: <Attendance /> },
=======
>>>>>>> 09696dd731b594f522cba6f334b328f91173ac73
      { path: 'settings', element: <Settings /> },
      { path: 'appraisal', element: <Appraisal /> },
      { path: '*', element: <Navigate to="/404" /> }
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
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
