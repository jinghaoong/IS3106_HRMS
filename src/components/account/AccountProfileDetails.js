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
import {
  updateDoc,
  doc,
  getDoc
}
from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// import { db } from '../firebase-config';
import { useEffect, useState } from 'react';
import DateTimePicker from '@mui/lab/DateTimePicker';
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

const AccountProfileDetails = (props) => {
  const [values, setValues] = useState('');
  const [currEmp, setCurrEmp] = useState([]);
  const [currUser, setCurrUser] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
    } else {
      setCurrUser(null);
    }
  });

  useEffect(() => {
    const getEmp = async () => {
      await getDoc(doc(db, 'users', `${currUser.email}`)).then((docSnap) => {
        if (docSnap.exists()) {
          setCurrEmp(docSnap.data());
        }
      });
    };
    getEmp();
  }, [currUser, currEmp]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeRef = doc(db, 'users', currEmp.email);
    // const ref2 = doc(db, 'users', `${currEmp.email}`);
    // setDoc(employeeRef, { ...values });
    await updateDoc(employeeRef, { ...values });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      handleSubmit
      {...props}
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
                value={values.firstName}
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
                value={values.lastName}
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
                value={values.dob}
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
                value={values.contact}
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
                value={values.identificationNo}
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
                value={values.bank}
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
  );
};

export default AccountProfileDetails;
