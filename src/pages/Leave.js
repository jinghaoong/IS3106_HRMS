import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import leaveApplications from 'src/__mocks__/LeaveApplications';
import LeaveResults from '../components/leave/LeaveResults';

const Leave = () => {
  console.log('leaveApplications', leaveApplications);
  return (
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
          <Box sx={{ pt: 3 }}>
            <LeaveResults leaveApplications={leaveApplications} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

console.log('Current leave applications', Leave.length);
export default Leave;
