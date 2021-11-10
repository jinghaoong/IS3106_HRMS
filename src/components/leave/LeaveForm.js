import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, TextField
} from '@material-ui/core';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { MenuItem } from '@mui/material';
import { add } from 'date-fns';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { Formik } from 'formik';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { auth, db } from '../../firebase-config';

const LeaveForm = ({
  leaveRequest,
  // setLeaveRequest,
  dialogType,
  open,
  handleClose
}) => {
  const [employees, setEmployees] = useState([]);
  const employeesRef = (collection(db, 'users'));

  const getEmployees = async () => {
    const querySnapshot = await getDocs(employeesRef);
    setEmployees(querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id })));
  };

  useEffect(() => {
    getEmployees();
    console.log(employees);
  }, []);

  const viewOnly = dialogType === 'view';

  const leaveTypes = [
    {
      key: 'Annual',
      value: 'annual',
    },
    {
      key: 'Medical',
      value: 'medical',
    },
    {
      key: 'Childcare',
      value: 'childcare',
    },
    {
      key: 'Maternity',
      value: 'maternity',
    },
    {
      key: 'Paternity',
      value: 'Paternity',
    },
    {
      key: 'Compassionate',
      value: 'compassionate',
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {dialogType === 'create' && <div>New Leave Request</div>}
        {dialogType === 'view' && <div>{`View Leave Request: id = ${leaveRequest.id}`}</div>}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center'
          }}
        >
          <Container maxWidth="sm">
            <Formik
              initialValues={{
                employee: leaveRequest.employee === undefined ? '' : leaveRequest.employee,
                type: leaveRequest.type === undefined ? '' : leaveRequest.type,
                startDate: leaveRequest.startDate === undefined
                  ? new Date() : leaveRequest.startDate.toDate(),
                endDate: leaveRequest.endDate === undefined
                  ? add(new Date(), { days: 1 }) : leaveRequest.endDate.toDate(),
                remarks: leaveRequest.remarks === undefined ? '' : leaveRequest.remarks,
                approved: leaveRequest.approved,
              }}
              validationSchema={Yup.object().shape({
                employee: Yup.string().email('Must be a valid email').max(255).required('Enter Employee Email'),
                startDate: Yup.date().required('Enter Start Date "dd-mm-yyyy"'),
                endDate: Yup.date().min(Yup.ref('startDate'), 'End Date cannot be before Start Date').required('Enter End Date "dd-mm-yyyy"'),
                remarks: Yup.string(),
              })}
              onSubmit={(values, actions) => {
                const temp = {
                  employee: values.employee,
                  type: values.type,
                  startDate: Timestamp.fromDate(values.startDate),
                  endDate: Timestamp.fromDate(values.endDate),
                  remarks: values.remarks,
                  approved: dialogType === 'create' ? false : values.approved,
                  editedBy: viewOnly ? auth.currentUser.email : null,
                };

                if (viewOnly) {
                  setDoc(doc(db, 'leave', leaveRequest.id), temp)
                    .then(() => {
                      console.log('doc set');
                      handleClose();
                    })
                    .catch((error) => {
                      console.log(error.message);
                      actions.setErrors({ submit: error.message });
                      actions.setSubmitting(false);
                    });
                } else {
                  addDoc(collection(db, 'leave'), temp)
                    .then(() => {
                      console.log('doc added');
                      handleClose();
                    })
                    .catch((error) => {
                      console.log(error.message);
                      actions.setErrors({ submit: error.message });
                      actions.setSubmitting(false);
                    });
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                touched,
                values
              }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    error={Boolean(touched.employee && errors.employee)}
                    select
                    fullWidth
                    helperText={touched.employee && errors.employee}
                    label="Employee Email"
                    margin="normal"
                    name="employee"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="string"
                    value={values.employee}
                    variant="outlined"
                    InputProps={{
                      readOnly: dialogType === 'view'
                    }}
                  >
                    {employees.map((option) => (
                      <MenuItem key={option.email} value={option.email}>
                        {option.email}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    error={Boolean(touched.type && errors.type)}
                    select
                    fullWidth
                    helperText={touched.type && errors.type}
                    label="Leave Type"
                    margin="normal"
                    name="type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="string"
                    value={values.type}
                    variant="outlined"
                  >
                    {leaveTypes.map((type) => (
                      <MenuItem key={type.key} value={type.value}>
                        {type.key}
                      </MenuItem>
                    ))}
                  </TextField>
                  <DesktopDatePicker
                    renderInput={(params) => <TextField {...params} />}
                    label="Start Date"
                    name="startDate"
                    value={values.startDate}
                    onChange={(newStart) => {
                      setFieldValue('startDate', newStart);
                    }}
                    readOnly={dialogType === 'view'}
                  />
                  <DesktopDatePicker
                    renderInput={(params) => <TextField {...params} />}
                    label="End Date"
                    name="endDate"
                    value={values.endDate}
                    onChange={(newEnd) => {
                      setFieldValue('endDate', newEnd);
                    }}
                    readOnly={dialogType === 'view'}
                  />
                  <TextField
                    error={Boolean(touched.remarks && errors.remarks)}
                    fullWidth
                    helperText={touched.remarks && errors.remarks}
                    label="Remarks"
                    margin="normal"
                    name="remarks"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="string"
                    value={values.remarks}
                    variant="outlined"
                  />
                  <Box sx={{ py: 2 }}>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      {viewOnly ? 'Update' : 'Submit'}
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Container>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

LeaveForm.propTypes = {
  leaveRequest: PropTypes.object,
  // setLeaveRequest: PropTypes.func,
  dialogType: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

export default LeaveForm;
