import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import EmployeeListResults from '../components/employees/employeeListResults';
import EmployeeListToolbar from '../components/employees/employeeListToolbar';
import employees from '../__mocks__/employees';

const EmployeeList = () => (
  <>
    <Helmet>
      <title>Employees | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <EmployeeListToolbar />
        <Box sx={{ pt: 3 }}>
          <EmployeeListResults employees={employees} />
        </Box>
      </Container>
    </Box>
  </>
);

console.log(Array.isArray(EmployeeList));
export default EmployeeList;
