import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import EmployeeListResults from '../components/employees/employeeListResults';
import LeaveToolbar from '../components/leave/LeaveToolbar';
import employees from '../__mocks__/employees';

const Leave = () => (
  <>
    <Helmet>
      <title>HRMS | Leave Management</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <LeaveToolbar />
        <Box sx={{ pt: 3 }}>
          <EmployeeListResults employees={employees} />
        </Box>
      </Container>
    </Box>
  </>
);

// console.log(Array.isArray(Leave));
export default Leave;
