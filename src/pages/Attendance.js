import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Box, Container } from '@material-ui/core';
import AttendanceListResults from '../components/attendance/attendanceListResults';

const Attendance = ({ employees }) => {
  console.log(employees);
  return (
    <>
      <Helmet>
        <title>Attendance | Material Kit</title>
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
            <AttendanceListResults employees={employees} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Attendance.propTypes = {
  employees: PropTypes.array.isRequired
};

export default Attendance;
