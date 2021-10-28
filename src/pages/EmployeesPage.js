import { Helmet } from 'react-helmet';
// import { PropTypes } from 'prop-types';
import {
  // Alert,
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  // Typography,
} from '@material-ui/core';
import { InputAdornment } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { useState, useEffect, } from 'react';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { db } from '../firebase-config';

const EmployeesPage = () => {
  const [employeesPage, setEmployeesPage] = useState([]);
  const employeesPageRef = (collection(db, 'users'));

  const getEmployeesPage = async () => {
    const data = await getDocs(employeesPageRef);
    setEmployeesPage(data.docs.map((d) => ({ ...d.data(), id: d.id })));
  };

  useEffect(() => {
    getEmployeesPage();
  }, []);

  const [employee, setEmployeePage] = useState([]);
  const [dialogType, setDialogType] = useState('create');

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setEmployeePage([]);
    getEmployeesPage();
    setOpen(false);
  };

  const CreateButton = () => (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => {
        setDialogType('create');
        setEmployeePage([]);
        console.log(dialogType);
        handleClickOpen();
      }}
    >
      Create Employee
    </Button>
  );

  const actionsButtonGroup = (params) => (
    <ButtonGroup>
      <IconButton onClick={() => {
        setDialogType('edit');
        setEmployeePage(params.row);
        console.log(dialogType);
        handleClickOpen();
      }}
      >
        <EditIcon />
      </IconButton>
    </ButtonGroup>
  );

  const rows = employeesPage;

  const columns = [
    {
      field: 'id',
      headerName: 'Employee ID',
      width: 200,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 130,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 130,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
    },
    {
      field: 'contact',
      headerName: 'Contact',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'dob',
      headerName: 'DOB',
      width: 200,
    },
    {
      field: 'startDate',
      headerName: 'Joined On',
      width: 200,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: actionsButtonGroup
    }
  ];

  console.log(employeesPage);

  return (
    <>
      <Helmet>
        <title>Employees Page</title>
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
            <CreateButton />
            <div style={{ height: 800, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                components={{
                  Toolbar: GridToolbar,
                }}
              />
            </div>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                {dialogType === 'create' && <div>Create Employee</div>}
                {dialogType === 'edit' && <div>Edit Employee</div>}
              </DialogTitle>
              {dialogType !== 'delete'
                && (
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
                            id: employee.id,
                            firstName: employee.firstName,
                            lastName: employee.lastName,
                            role: employee.role,
                            contact: employee.contact,
                            email: employee.email,
                            salary: employee.salary,
                            dob: employee.dob === undefined
                              ? new Date() : employee.dob.toDate(),
                            startDate: employee.startDate === undefined
                              ? new Date() : employee.startDate.toDate(),
                          }}
                          validationSchema={Yup.object().shape({
                            id: Yup.string(),
                            firstName: Yup.string().required('Enter First Name'),
                            lastName: Yup.string().required('Enter Last Name'),
                            role: Yup.string().required('Enter Role'),
                            contact: Yup.string().required('Enter Contact'),
                            email: Yup.string().required('Enter Email'),
                            salary: Yup.number().required('Enter Salary'),
                            dob: Yup.date().required('Enter Date of Birth'),
                            startDate: Yup.date().required('Enter Start Date'),
                          })}
                          onSubmit={(values, actions) => {
                            const temp2 = {
                              firstName: values.firstName,
                              lastName: values.lastName,
                              role: values.role,
                              contact: values.contact,
                              email: values.email,
                              salary: values.salary,
                              dob: Timestamp.fromDate(values.dob),
                              startDate: Timestamp.fromDate(values.startDate)
                            };

                            if (dialogType === 'create') {
                              addDoc(doc(db, 'user'), temp2)
                                .then(() => {
                                  console.log('doc set');
                                  handleClose();
                                })
                                .catch((error) => {
                                  console.log(error.message);
                                  actions.setErrors({ submit: error.message });
                                  actions.setSubmitting(false);
                                });
                            }

                            const temp = {
                              id: values.id,
                              firstName: values.firstName,
                              lastName: values.lastName,
                              role: values.role,
                              contact: values.contact,
                              email: values.email,
                              salary: values.salary,
                              dob: Timestamp.fromDate(values.dob),
                              startDate: Timestamp.fromDate(values.startDate),
                              endDate: Timestamp.fromDate(values.endDate),
                            };

                            setEmployeePage(temp);

                            setDoc(doc(db, 'user', values.id), temp)
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
                            <form onSubmit={handleSubmit}>
                              <TextField
                                error={Boolean(touched.id && errors.id)}
                                fullWidth
                                helperText={touched.id && errors.id}
                                label="Employee ID"
                                margin="normal"
                                name="id"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="string"
                                value={values.id}
                                variant="outlined"
                                InputProps={{
                                  readOnly: dialogType === 'edit'
                                }}
                              />
                              <TextField
                                error={Boolean(touched.firstName && errors.firstName)}
                                fullWidth
                                helperText={touched.firstName && errors.firstName}
                                label="First Name"
                                margin="normal"
                                name="firstName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="string"
                                value={values.firstName}
                                variant="outlined"
                              />
                              <TextField
                                error={Boolean(touched.lastName && errors.lastName)}
                                fullWidth
                                helperText={touched.lastName && errors.lastName}
                                label="Last Name"
                                margin="normal"
                                name="lastName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="string"
                                value={values.lastName}
                                variant="outlined"
                              />
                              <TextField
                                error={Boolean(touched.role && errors.role)}
                                fullWidth
                                helperText={touched.role && errors.role}
                                label="Role"
                                margin="normal"
                                name="role"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="string"
                                value={values.role}
                                variant="outlined"
                              />
                              <TextField
                                error={Boolean(touched.contact && errors.contact)}
                                fullWidth
                                helperText={touched.contact && errors.contact}
                                label="Contact"
                                margin="normal"
                                name="contact"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="string"
                                value={values.contact}
                                variant="outlined"
                              />
                              <TextField
                                error={Boolean(touched.email && errors.email)}
                                fullWidth
                                helperText={touched.email && errors.email}
                                label="Email"
                                margin="normal"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="string"
                                value={values.email}
                                variant="outlined"
                              />
                              <TextField
                                error={Boolean(touched.salary && errors.salary)}
                                fullWidth
                                helperText={touched.salary && errors.salary}
                                label="Salary"
                                margin="normal"
                                name="salary"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="number"
                                value={values.salary}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                              />
                              <DateTimePicker
                                renderInput={(params) => <TextField {...params} />}
                                label="Date of Birth"
                                name="dob"
                                value={values.dob}
                                onChange={(newDOB) => {
                                  setFieldValue('dob', newDOB);
                                }}
                              />
                              <DateTimePicker
                                renderInput={(params) => <TextField {...params} />}
                                label="Start Date"
                                name="startDate"
                                value={values.startDate}
                                onChange={(newStart) => {
                                  setFieldValue('startDate', newStart);
                                }}
                              />
                              <DateTimePicker
                                renderInput={(params) => <TextField {...params} />}
                                label="End Date"
                                name="endDate"
                                value={values.endDate}
                                onChange={(newEnd) => {
                                  setFieldValue('endDate', newEnd);
                                }}
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

export default EmployeesPage;
