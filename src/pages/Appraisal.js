import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Box, Container } from '@material-ui/core';
import AppraisalForm from '../components/appraisal/appraisalForm';
import AppraisalList from '../components/appraisal/appraisalList';

const Appraisal = ({ appraisal, employees, appraisalForm }) => (
  <>
    <Helmet>
      <title>HRMS | Appraisal Portal</title>
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
          <AppraisalForm appraisalForm={appraisalForm} />
          <AppraisalList appraisal={appraisal} employees={employees} appraisalForm={appraisalForm} />
        </Box>
      </Container>
    </Box>
  </>
);

Appraisal.propTypes = {
  appraisal: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired,
  appraisalForm: PropTypes.array.isRequired,
};

export default Appraisal;
