// import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
<<<<<<< HEAD
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// import { db } from '../firebase-config';
=======
import {
  updateDoc,
  getDoc,
  doc,
} from 'firebase/firestore';
>>>>>>> dd5a72bebf6809d02ae6aec54d16b992ed7f58b1
import { useEffect, useState } from 'react';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AccountProfile from './AccountProfile';
import { db, auth } from '../../firebase-config';

const banks = [
  {
    value: 'dbs',
    label: 'DBS/POSB'
  },
  {
    value: 'uob',
    label: 'UOB'
  },
  {
    value: 'ocbc',
    label: 'OCBC'
  },
  {
    value: 'scb',
    label: 'Standard Chartered Bank'
  },
  {
    value: 'hlf',
    label: 'Hong Leong Finance'
  },
  {
    value: 'citibank',
    label: 'Citibank Singapore'
  },
  {
    value: 'hsbc',
    label: 'HSBC'
  },
  {
    value: 'sbi',
    label: 'State Bank of India'
  },
  {
    value: 'bcb',
    label: 'Barclays Bank'
  },
  {
    value: 'boc',
    label: 'Bank of China'
  },
  {
    value: 'others',
    label: 'Others'
  }
];

const AccountProfileDetails = () => {
  const [currEmp, setCurrEmp] = useState([]);
  const [value, setValues] = useState([]);

  const currEmployee = async () => {
    await getDoc(doc(db, 'users', (auth.currentUser).email)).then((docSnap) => {
      if (docSnap.exists()) {
        setCurrEmp(docSnap.data());
        console.log('Current employee is ', currEmp);
      } else {
        console.log('No such document!');
      }
    });
  };

  useEffect(() => {
    currEmployee();
  }, []);

  const handleChange = (event) => {
    setValues({
      ...value,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeRef = doc(db, 'users', currEmp.email);
    await updateDoc(employeeRef, { ...value });
    window.location.reload();
  };

  return (
<<<<<<< HEAD
    <form autoComplete="off" noValidate handleSubmit {...props}>
      <Card>
        <CardHeader
          subheader="Edit your profile details here."
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <DateTimePicker
                renderInput={(params) => <TextField {...params} />}
                label="Date of Birth"
                name="dob"
                value={values.dob}
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.contact}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="IC Number"
                name="identificationNo"
                onChange={handleChange}
                required
                value={values.identificationNo}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Select Bank"
                name="bank"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.bank}
                variant="outlined"
              >
                {banks.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
=======
    <>
      <AccountProfile />
      <form
        autoComplete="off"
        noValidate
        handleSubmit
        {...value}
      >
        <Card>
          <CardHeader
            subheader="Edit your profile details here."
            title="Profile"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={value.firstName}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={value.lastName}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <DateTimePicker
                  renderInput={(params) => <TextField {...params} />}
                  label="Date of Birth"
                  name="dob"
                  value={value.dob}
                  required
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={value.contact}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="IC Number"
                  name="identificationNo"
                  onChange={handleChange}
                  required
                  value={value.identificationNo}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Select Bank"
                  name="bank"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={value.bank}
                  variant="outlined"
                >
                  {banks.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
>>>>>>> dd5a72bebf6809d02ae6aec54d16b992ed7f58b1
            </Grid>
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2
            }}
          >
            <Button
              color="primary"
              variant="contained"
              type="submit"
              value="submit"
              onClick={handleSubmit}
            >
              Save details
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
};

export default AccountProfileDetails;
