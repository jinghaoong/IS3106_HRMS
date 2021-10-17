import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import EmployeeListResults from '../components/employee/EmployeeListResults';
import EmployeeListToolbar from '../components/employee/EmployeeListToolbar';
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

export default EmployeeList;
