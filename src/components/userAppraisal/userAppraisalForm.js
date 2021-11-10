import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc } from 'firebase/firestore';

import {
  Box,
  Button,
  TextField,
  Card,
  Paper,
  CardHeader
} from '@material-ui/core';

import { Rating } from 'react-simple-star-rating';
import { auth, db } from '../../firebase-config';

const UserAppraisalForm = () => {
  const [appraisal, setAppraisal] = useState([]);
  const appraisalRef = collection(db, 'appraisals');
  const [appraisalForm, setAppraisalForm] = useState([]);
  const appraisalFormRef = collection(db, 'appraisalForm');
  const [ratings, setRating] = useState(0);
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const [employees, setEmployees] = useState([]);
  const employeesRef = collection(db, 'users');

  const initialFieldValues = {
    appraiseeEmail: '',
    rating: 0,
    feedback: '',
    date: new Date()
  };

  const [values, setValues] = useState(initialFieldValues);

  useEffect(() => {
    const getAppraisal = async () => {
      const data = await getDocs(appraisalRef);
      setAppraisal(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getAppraisalForm = async () => {
      const data = await getDocs(appraisalFormRef);
      setAppraisalForm(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getEmployees = async () => {
      const data = await getDocs(employeesRef);
      setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getAppraisalForm();
    getEmployees();
    getAppraisal();
  }, []);

  const [currUser, setCurrUser] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
    } else {
      setCurrUser(null);
    }
  });

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
      appraiseeEmail: '',
      feedback: '',
      date: new Date()
    });
    setRating(0);
  }

  const createAppraisal = async () => {
    console.log(values.appraiseeEmail);
    console.log(currUser.email);
    await addDoc(appraisalRef, {
      appraiserId: currUser.email,
      appraiseeId: values.appraiseeEmail,
      rating: ratings,
      feedback: values.feedback,
      date: values.date
    });
  };

  const formatDate = (date) => {
    if (date !== null) {
      const formattedDate = date.toString().split(' ').slice(1, 4);
      const newDate = formattedDate.join('-');
      return (newDate);
    }
    return '';
  };

  function findEmployee(uId) {
    const em = Array.from(employees).filter((obj) => {
      if (obj.id === uId) {
        return obj;
      }
      return null;
    });
    return em[0];
  }

  const getCycle = (dataDate) => {
    let cycle = [];
    cycle = Array.from(appraisalForm).filter((obj) => {
      const sDate = new Date(obj.startDate.seconds * 1000).toString();
      const eDate = new Date(obj.endDate.seconds * 1000).toString();
      console.log(formatDate(sDate) <= formatDate(dataDate) && formatDate(eDate) >= formatDate(dataDate));
      if (formatDate(sDate) <= formatDate(dataDate) && formatDate(eDate) >= formatDate(dataDate)) {
        return obj;
      }
      return null;
    });

    const start = formatDate(new Date(cycle[0].startDate.seconds * 1000).toString());
    const end = formatDate(new Date(cycle[0].endDate.seconds * 1000).toString());
    return `${start} to ${end}`;
  };

  const handleSubmit = (e) => {
    let arr = [];
    arr = Array.from(appraisal).filter((obj) => {
      console.log(new Date());
      console.log(new Date(obj.date.seconds * 1000));
      if (getCycle(new Date(obj.date.seconds * 1000)) === getCycle(new Date())) {
        if (obj.appraiseeId === values.appraiseeEmail && obj.appraiserId === currUser.email) {
          return obj;
        }
        return null;
      }
      return null;
    });
    if (arr.length === 0) {
      if (findEmployee(currUser.email).role === 'Employee' && values.appraiseeEmail !== currUser.email) {
        setWarning('Only self evaluation is allowed!');
        setSuccess('');
      } else if (findEmployee(values.appraiseeEmail) === null || findEmployee(values.appraiseeEmail) === undefined) {
        setWarning('Appraisee Email does not exists!');
        setSuccess('');
      } else {
        e.preventDefault();
        createAppraisal();
        resetForm();
        setWarning('');
        setSuccess('Appraisal Successful!');
      }
    } else {
      setWarning('Already appraised this appraisee!');
      setSuccess('');
    }
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <Card>
      <CardHeader
        title="Submit New Appraisal"
        titleTypographyProps={{ variant: 'h1' }}
      />
      <Paper sx={{
        height: '50%',
        p: 5,
      }}
      >
        <div>&nbsp;</div>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{
              width: '90%',
            }}
            variant="outlined"
            label="Appraisee Email (for Self Evaluation, please type in your own email)"
            name="appraiseeEmail"
            value={values.appraiseeEmail}
            onChange={handleInputChange}
          />
          <div>&nbsp;</div>
          <div sx={{ mx: 5 }}>
            <h3>
              Ratings:
            </h3>
            <Rating
              name="ratings"
              onClick={handleRating}
              ratingValue={ratings}
              fillColor="#f1a545"
            />
          </div>
          <div>&nbsp; </div>
          <TextField
            sx={{
              width: '90%',
            }}
            multiline
            rows={8}
            variant="outlined"
            label="Feedback"
            name="feedback"
            value={values.feedback}
            onChange={handleInputChange}
            required
          />
          <div>&nbsp; </div>
          <div>
            <Button
              sx={{ width: 200 }}
              value="Submit"
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </form>
        <div>
          {warning === '' ? (<Box />)
            : (
              <Box className="warning-box">
                {warning}
              </Box>
            )}
          {success === '' ? (<Box />)
            : (
              <Box className="successful-box">
                {success}
              </Box>
            )}
        </div>
      </Paper>
    </Card>
  );
};

export default UserAppraisalForm;