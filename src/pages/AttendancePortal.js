import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import EmployeesListResults from '../components/employees/employeeListResults';
import EmployeesListToolbar from '../components/employees/employeeListToolbar';
import employees from '../__mocks__/customers';

const AttendanceList = () => (
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
          <EmployeesListResults employees={employees} />
        </Box>
      </Container>
    </Box>
  </>
);

export default AttendanceList;
