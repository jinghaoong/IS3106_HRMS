import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import LeaveApplicationsResults from '../components/leave/LeaveApplicationsResults';
import LeaveToolbar from '../components/leave/LeaveToolbar';
import leaveApplications from '../__mocks__/LeaveApplications';

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
          <LeaveApplicationsResults leaveApplications={leaveApplications} />
        </Box>
      </Container>
    </Box>
  </>
);

// console.log(Array.isArray(Leave));
export default Leave;
