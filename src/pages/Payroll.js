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
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  // Typography,
} from '@material-ui/core';
import { InputAdornment } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
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
import { format } from 'date-fns';

import { db } from '../firebase-config';

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const payrollRef = (collection(db, 'payroll'));

  const getPayroll = async () => {
    const data = await getDocs(payrollRef);
    setPayroll(data.docs.map((d) => ({ ...d.data(), id: d.id })));
  };

  useEffect(() => {
    getPayroll();
  }, []);

  const [payslip, setPayslip] = useState([]);
  const [dialogType, setDialogType] = useState('create');

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPayslip([]);
    getPayroll();
    setOpen(false);
  };

  const CreateButton = () => (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => {
        setDialogType('create');
        setPayslip([]);
        console.log(dialogType);
        handleClickOpen();
      }}
    >
      Create Payroll
    </Button>
  );

  const actionsButtonGroup = (params) => (
    <ButtonGroup>
      <IconButton onClick={() => {
        setDialogType('edit');
        setPayslip(params.row);
        console.log(dialogType);
        handleClickOpen();
      }}
      >
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => {
        setDialogType('delete');
        setPayslip(params.row);
        console.log(dialogType);
        handleClickOpen();
      }}
      >
        <DeleteIcon />
      </IconButton>
    </ButtonGroup>
  );

  const rows = payroll;

  const columns = [
    {
      field: 'id',
      headerName: 'Payslip ID',
      width: 250,
    },
    {
      field: 'basic',
      headerName: 'Basic',
      width: 130,
      type: 'number',
    },
    {
      field: 'overtime',
      headerName: 'Overtime',
      width: 150,
      type: 'number',
    },
    {
      field: 'cpfEmployee',
      headerName: 'CPF (Employee)',
      width: 200,
      type: 'number'
    },
    {
      field: 'cpfEmployer',
      headerName: 'CPF (Employer)',
      width: 200,
      type: 'number'
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      width: 200,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
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

  console.log(payroll);
  console.log(payslip);

  return (
    <>
      <Helmet>
        <title>Payroll</title>
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
                {dialogType === 'create' && <div>Create Payslip</div>}
                {dialogType === 'edit' && <div>Edit Payslip</div>}
                {dialogType === 'delete' && <div>Delete Payslip</div>}
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
                            id: payslip.id,
                            email: payslip.email,
                            basic: payslip.basic,
                            overtime: payslip.overtime,
                            cpfEmployee: payslip.cpfEmployee,
                            cpfEmployer: payslip.cpfEmployer,
                            startDate: payslip.startDate === undefined
                              ? new Date() : payslip.startDate.toDate(),
                            endDate: payslip.endDate === undefined
                              ? new Date() : payslip.endDate.toDate(),
                            paymentMode: payslip.paymentMode,
                            remarks: payslip.remarks === undefined
                              ? '' : payslip.remarks,
                          }}
                          validationSchema={Yup.object().shape({
                            email: Yup.string().email('Must be a valid email').max(255).required('Enter Employee Email'),
                            basic: Yup.number().required('Enter Basic Pay'),
                            overtime: Yup.number().required('Enter Overtime Pay'),
                            cpfEmployee: Yup.number(),
                            cpfEmployer: Yup.number(),
                            startDate: Yup.date().required('Enter Start Date'),
                            endDate: Yup.date().required('Enter End Date'),
                            paymentMode: Yup.string().required('Enter Payment Mode'),
                            remarks: Yup.string(),
                          })}
                          onSubmit={(values, actions) => {
                            const newId = `${values.email}_${format(values.endDate, 'dd-MM-yyyy')}`;

                            const temp = {
                              id: newId,
                              email: values.email,
                              basic: values.basic,
                              overtime: values.overtime,
                              cpfEmployee: values.cpfEmployee,
                              cpfEmployer: values.cpfEmployer,
                              startDate: Timestamp.fromDate(values.startDate),
                              endDate: Timestamp.fromDate(values.endDate),
                              paymentMode: values.paymentMode,
                              remarks: values.remarks
                            };

                            setPayslip(temp);

                            if (dialogType === 'edit') {
                              deleteDoc(doc(db, 'payroll', values.id));
                            }

                            setDoc(doc(db, 'payroll', newId), temp)
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
                                error={Boolean(touched.email && errors.email)}
                                fullWidth
                                helperText={touched.email && errors.email}
                                label="Employee Email"
                                margin="normal"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="string"
                                value={values.email}
                                variant="outlined"
                                InputProps={{
                                  readOnly: dialogType === 'edit'
                                }}
                              />
                              <TextField
                                error={Boolean(touched.basic && errors.basic)}
                                fullWidth
                                helperText={touched.basic && errors.basic}
                                label="Basic Pay"
                                margin="normal"
                                name="basic"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="number"
                                value={values.basic}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                              />
                              <TextField
                                error={Boolean(touched.overtime && errors.overtime)}
                                fullWidth
                                helperText={touched.overtime && errors.overtime}
                                label="Overtime Pay"
                                margin="normal"
                                name="overtime"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="number"
                                value={values.overtime}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                              />
                              <TextField
                                error={Boolean(touched.cpfEmployee && errors.cpfEmployee)}
                                fullWidth
                                helperText={touched.cpfEmployee && errors.cpfEmployee}
                                label="Employee CPF"
                                margin="normal"
                                name="cpfEmployee"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="number"
                                value={values.cpfEmployee}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                              />
                              <TextField
                                error={Boolean(touched.cpfEmployer && errors.cpfEmployer)}
                                fullWidth
                                helperText={touched.cpfEmployer && errors.cpfEmployer}
                                label="Employer CPF"
                                margin="normal"
                                name="cpfEmployer"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="number"
                                value={values.cpfEmployer}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
                              <TextField
                                error={Boolean(touched.paymentMode && errors.paymentMode)}
                                fullWidth
                                helperText={touched.paymentMode && errors.paymentMode}
                                label="Payment Mode"
                                margin="normal"
                                name="paymentMode"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="string"
                                value={values.paymentMode}
                                variant="outlined"
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
              {dialogType === 'delete'
                && (
                  <DialogContent>
                    Confirm Deletion of Payslip ID:&nbsp;
                    <b>{payslip.id}</b>
                  </DialogContent>
                )}
              <DialogActions>
                {dialogType === 'delete'
                  && (
                    <Button
                      color="error"
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        deleteDoc(doc(db, 'payroll', payslip.id))
                          .then(() => {
                            console.log('Payslip deleted');
                            handleClose();
                          })
                          .catch((error) => {
                            console.log(error.message);
                          });
                      }}
                    >
                      Confirm
                    </Button>
                  )}
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Payroll;
