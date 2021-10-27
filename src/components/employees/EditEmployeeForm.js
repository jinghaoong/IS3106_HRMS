import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
// import { addEmployee } from './EmployeeService';

const useStyle = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      width: '50%',
      margin: theme.spacing(1),
      padding: theme.spacing(1)
    }
  }
}));

const initialFieldValues = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  contact: '',
  address: '',
  role: 'employee',
  dob: new Date(),
  identificationNumber: '',
  startDate: new Date(),
  salary: '',
  bank: '',
  bankAccNum: '',
  dietaryRestrictions: '',
  ethnicity: '',
  endDate: 'N.A',
  active: 'active'
};

function EditEmployeeForm(props) {
  const { editValues, recordForEdit } = props;
  const [values, setValues] = useState(initialFieldValues);
  const classes = useStyle();

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({ ...recordForEdit });
    }
  }, [recordForEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues(
      {
        ...values,
        [name]: value
      }
    );
  };

  function resetForm() {
    setValues({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      contact: '',
      address: '',
      role: 'employee',
      dob: new Date(),
      identificationNumber: '',
      startDate: new Date(),
      salary: '',
      bank: '',
      bankAccNum: '',
      dietaryRestrictions: '',
      ethnicity: '',
      endDate: 'N.A',
      active: 'active'
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    editValues(values, resetForm);
    // addEmployee(values);
    // console.log('New user created', docRef.id);
    // employeeService.insertEmployee(values);
    // resetForm();
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Grid container spacing={4} columns={6} rows={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Username"
            name="username"
            value={values.username}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Contact"
            name="contact"
            value={values.contact}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Address"
            name="address"
            value={values.address}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Role"
            name="role"
            value={values.role}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Date of Birth (mm/DD/yyyy)"
            name="dob"
            value={values.dob}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="IC No."
            name="identificationNumber"
            value={values.identificationNumber}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Start Date (mm/DD/yyyy)"
            name="startDate"
            value={values.startDate}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Salary"
            name="salary"
            value={values.salary}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Bank"
            name="bank"
            value={values.bank}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Bank Account No."
            name="bankAccNum"
            value={values.bankAccNum}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Dietary Restrictions"
            name="dietaryRestrictions"
            value={values.dietaryRestrictions}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Ethnicity"
            name="ethnicity"
            value={values.ethnicity}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="End Date"
            name="endDate"
            value={values.endDate}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            label="Status"
            name="status"
            value={values.active}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <input type="Submit" value="Submit" />
    </form>
  );
}

EditEmployeeForm.propTypes = {
  editValues: PropTypes.any.isRequired,
  recordForEdit: PropTypes.any.isRequired
};

export default EditEmployeeForm;
