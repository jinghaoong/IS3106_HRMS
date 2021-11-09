import moment from 'moment';
import {
  Avatar,
  Box,
  Typography,
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
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
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

const AccountProfileDetails = () => {
  const currUser = auth.currentUser;
  const [currEmp, setCurrEmp] = useState([]);
  const [values, setValues] = useState([]);
  const userRef = collection(db, 'users');

  const { email, } = currUser;

  const getEmp = async () => {
    const q = query(userRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    setCurrEmp(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    console.log(currEmp);
  };

  useEffect(() => {
    getEmp();
  }, []);

  const empDOB = currEmp[0].dob ? moment(currEmp[0].dob.toDate()).calendar() : '';
  const empStart = currEmp[0].startDate ? moment(currEmp[0].startDate.toDate()).calendar() : '';

  console.log(currEmp);
  console.log(currEmp);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeRef = doc(db, 'users', currEmp[0].email);
    await updateDoc(employeeRef, { ...values });
  };

  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={currEmp[0].avatar}
          sx={{
            height: 100,
            width: 100
          }}
        />
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h3"
        >
          {`${currEmp[0].firstName} ${currEmp[0].lastName}`}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {currEmp[0].identificationNo}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {currEmp[0].email}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {currEmp[0].address}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {currEmp[0].role}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {currEmp[0].status}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {empDOB}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {empStart}
        </Typography>
      </Box>
      <form
        autoComplete="off"
        noValidate
        handleSubmit
        {...values[0]}
      >
        <Card>
          <CardHeader
            subheader="Edit your currEmp[0] details here."
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
    </>
  );
};

export default AccountProfileDetails;
