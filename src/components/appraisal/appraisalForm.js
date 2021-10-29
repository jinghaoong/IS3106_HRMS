import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
} from '@material-ui/core';

import AddForm from './addForm';
import EditForm from './editForm';
import './appraisal.css';

const AppraisalForm = ({ appraisalForm }) => {
  const [editState, setEditState] = useState(false);
  const [formView, setFormView] = useState(false);

  const handleEdit = () => {
    setEditState(!(editState));
  };

  const handleFormView = () => {
    setFormView(!(formView));
  };

  console.log(editState);

  return (formView) ? (
    <Card>
      <Box>
        <CardContent>
          <Box sx={{
            mx: 35,
          }}
          >
            <Paper
              sx={{
                p: 3,
                fontFamily: 'Calibri, sans-serif'
              }}
              variant="outlined"
            >
              <Button
                value=""
                variant="contained"
                color={formView ? 'error' : 'success'}
                onClick={() => (handleFormView())}
              >
                {formView ? 'Close Form' : 'Open Form'}
              </Button>
              <Button
                className="edit-btn"
                value=""
                variant="contained"
                onClick={() => (handleEdit())}
              >
                {editState ? 'Add' : 'Edit'}
              </Button>
              <div>&nbsp;</div>
              {editState ? <EditForm appraisalForm={appraisalForm} /> : <AddForm />}
            </Paper>
          </Box>
        </CardContent>
      </Box>
    </Card>
  ) : (
    <Card>
      <Box>
        <CardContent>
          <Box>
            <Button
              value=""
              variant="contained"
              color={formView ? 'error' : 'success'}
              onClick={() => (handleFormView())}
            >
              {formView ? 'Close Form' : 'Open Form'}
            </Button>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

AppraisalForm.propTypes = {
  appraisalForm: PropTypes.array.isRequired,
};

export default AppraisalForm;
