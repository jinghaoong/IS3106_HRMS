import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Box, Container } from '@material-ui/core';
import employeeListResults from '../components/employees/employeeListResults';

const EmployeeList = ({ employees }) => {
  console.log(employees);
  return (
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
          <Box sx={{ pt: 3 }}>
            <employeeListResults employees={employees} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

EmployeeList.propTypes = {
  employees: PropTypes.array.isRequired
};

console.log('Current employees ', EmployeeList.length);

export default EmployeeList;
