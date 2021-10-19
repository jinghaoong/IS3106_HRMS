import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
// import { collection, getDocs } from 'firebase/firestore';
// import { useState, useEffect } from 'react';
// import { app } from '../firebase-config';
import EmployeesListResults from '../components/employees/employeeListResults';
import EmployeesListToolbar from '../components/employees/employeeListToolbar';
import employees from '../__mocks__/employees';

const Attendance = () => {
  // const [employees, setEmployees] = useState([]);
  // const employeeRef = collection(app, 'users');

  // useEffect(() => {
  //   const getEmployees = async () => {
  //     const data = await getDocs(employeeRef);
  //     console.log(data);
  //   };
  //   getEmployees();
  // }, []);
  <>
    <Helmet>
      <title>HRMS | Attendance Portal</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <EmployeesListToolbar />
        <Box sx={{ pt: 3 }}>
          <EmployeesListResults employees={writeUserData} />
        </Box>
      </Container>
    </Box>
  </>;
};

export default Attendance;
