import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from '@material-ui/core';
import { MenuItem } from '@mui/material';
import { SearchIcon } from '@mui/icons-material/Search';

import {
  collection,
  getDocs,
  doc,
  setDoc
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { db } from 'src/firebase-config';

const leaveTypes = [
  { value: 'Medical', label: 'Medical' },
  { value: 'Annual', label: 'Annual' },
  { value: 'Unpaid', label: 'Unpaid' },
  { value: 'Others', label: 'Others' }
];

const leaveStatus = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' }
];

const LeaveResults = () => {
  const [leaveResults, setLeave] = useState([]);
  const leaveResultsRef = collection(db, 'leave');

  const getLeaveResults = async () => {
    const data = await getDocs(leaveResultsRef);
    setLeave(data.docs.map((d) => ({ ...d.data(), id: d.id })));
  };

  useEffect(() => {
    getLeaveResults();
  }, []);

  const [leave, setLeaveResult] = useState([]);
  const [dialogType, setDialogType] = useState('view'); // maybe change this

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setLeaveResult([]);
    getLeaveResults();
    setOpen(false);
  };

  // might have to change this
  const actionsButtonGroup = (params) => (
    <ButtonGroup>
      <IconButton
        onClick={() => {
          setDialogType('view');
          setLeaveResult(params.row);
          console.log(dialogType);
          handleClickOpen();
        }}
      >
        <SearchIcon />
      </IconButton>
    </ButtonGroup>
  );

  const rows = leaveResults;

  const columns = [
    {
      field: 'id',
      headerName: 'Leave ID',
      width: 250
    },
    {
      field: 'employeeName',
      headerName: 'Employee Name',
      width: 150
    },
    {
      field: 'date',
      headerName: 'Date Submitted',
      width: 150
    },
    {
      field: 'leaveType',
      headerName: 'Type of Leave',
      width: 150
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: actionsButtonGroup
    }
  ];

  console.log(leaveResults);

  return (
    <>
      <Helmet>
        <title>Leave Applications</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <div style={{ height: 800, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                components={{
                  Toolbar: GridToolbar
                }}
              />
            </div>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                {dialogType === 'view' && <div>View Leave</div>}
                <Box>
                  <Button
                    color="primary"
                    size="small"
                    type="close"
                    variant="contained"
                    onClick={handleClose}
                    style={{ float: 'right' }}
                  >
                    x
                  </Button>
                </Box>
              </DialogTitle>
              {dialogType !== 'delete' && (
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
                          id: '',
                          employeeName: leave.employeeName,
                          leaveType: leave.leaveType,
                          date:
                            leave.date === undefined
                              ? new Date()
                              : leave.date.toDate(),
                          leaveStatus: leave.status
                        }}
                        validationSchema={Yup.object().shape({
                          id: Yup.string(),
                          employeeName: Yup.string().required(
                            'Enter Employee Name'
                          ),
                          leaveType: Yup.string().required('Enter Leave Type'),
                          date: Yup.date().required('Enter Date Submitted'),
                          leaveStatus: Yup.string().required('Enter Leave Status')
                        })}
                        // might have to change this part
                        onSubmit={(values, actions) => {
                          if (dialogType === 'create') {
                            const newId = `${values.email}`;
                            console.log('new id is ', newId);
                            actions.setFieldValue('id', newId);
                          }
                          // till here
                          const temp = {
                            id: values.id,
                            employeeName: values.employeeName,
                            leaveType: values.leaveType,
                            date: values.date,
                            leaveStatus: values.leaveStatus
                          };

                          setLeaveResult(temp);
                          console.log('id currently is ', values.id);

                          setDoc(doc(db, 'leave', `${values.id}`), temp)
                            .then(() => {
                              console.log('doc set');
                              handleClose();
                            })
                            .catch((error) => {
                              console.log(error.message);
                              actions.setErrors({ submit: error.message });
                              actions.setSubmitting(false);
                            });
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
                          // for editing? need to change to for viewing, ie. navigation to page.
                          <form onSubmit={handleSubmit}>
                            <TextField
                              error={Boolean(
                                touched.employeeName && errors.employeeName
                              )}
                              fullWidth
                              helperText={
                                touched.employeeName && errors.employeeName
                              }
                              label="Employee Name"
                              margin="normal"
                              name="employeeName"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              type="string"
                              value={values.employeeName}
                              variant="outlined"
                            />
                            <DateTimePicker
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                              label="Date Submitted"
                              name="date"
                              value={values.date}
                              onChange={(newDate) => {
                                setFieldValue('date', newDate);
                              }}
                            />
                            <TextField
                              select
                              fullWidth
                              helperText={touched.leaveType && errors.leaveType}
                              label="Leave Type"
                              margin="normal"
                              name="leaveType"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              type="string"
                              value={values.leaveType}
                              variant="outlined"
                              labelId="label"
                            >
                              {leaveTypes.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              select
                              error={Boolean(
                                touched.leaveStatus && errors.leaveStatus
                              )}
                              fullWidth
                              helperText={
                                touched.leaveStatus && errors.leaveStatus
                              }
                              label="Leave Status"
                              margin="normal"
                              name="leaveStatus"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              type="string"
                              value={values.leaveStatus}
                              variant="outlined"
                            >
                              {leaveStatus.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.value}
                                </MenuItem>
                              ))}
                            </TextField>

                            <Box sx={{ py: 2 }}>
                              <Button
                                color="primary"
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                              >
                                Submit
                              </Button>
                            </Box>
                          </form>
                        )}
                      </Formik>
                    </Container>
                  </Box>
                </DialogContent>
              )}
            </Dialog>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LeaveResults;
