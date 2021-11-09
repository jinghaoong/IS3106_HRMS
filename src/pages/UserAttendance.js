import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';

// import UserAttendanceScanner from 'src/components/userAttendance/userAttendanceScanner';
import UserAttendanceButton from 'src/components/userAttendance/userAttendanceButton';
import UserAttendanceList from '../components/userAttendance/userAttendanceList';
import { auth } from '../firebase-config';

const UserAttendance = () => {
  const [currUser, setCurrUser] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
    } else {
      setCurrUser(null);
    }
  });

  return (
    <Box>
      <Helmet>
        <title>HRMS | Attendance Portal</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            <div>&nbsp;</div>
            <UserAttendanceButton />
            <UserAttendanceList />
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default UserAttendance;
