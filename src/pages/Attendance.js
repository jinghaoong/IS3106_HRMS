import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Box, Container } from '@material-ui/core';
import AttendanceListResults from '../components/attendance/attendanceListResults';

const Attendance = ({ attendance, employees }) => {
  console.log(Array.from(employees));
  return (
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
          <Box sx={{ pt: 3 }}>
            <AttendanceListResults attendance={attendance} employees={employees} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Attendance.propTypes = {
  attendance: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired
};

export default Attendance;
