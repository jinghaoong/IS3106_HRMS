import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Helmet } from 'react-helmet';
import { Box, Container, Button } from '@material-ui/core';
import UserAppraisalForm from 'src/components/userAppraisal/userAppraisalForm';
import UserAppraisalList from '../components/userAppraisal/userAppraisalList';
import { auth, db } from '../firebase-config';

const UserAppraisal = () => {
  const [viewForm, setViewForm] = useState(false);
  const [appraisalForm, setAppraisalForm] = useState([]);
  const appraisalFormRef = collection(db, 'appraisalForm');
  const [currUser, setCurrUser] = useState([]);

  useEffect(() => {
    const getAppraisalForm = async () => {
      const data = await getDocs(appraisalFormRef);
      setAppraisalForm(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getAppraisalForm();
  }, []);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
    } else {
      setCurrUser(null);
    }
  });

  const formatDate = (date) => {
    if (date !== null) {
      const formattedDate = date.toString().split(' ').slice(1, 4);
      const newDate = formattedDate.join('-');
      return (newDate);
    }
    return '';
  };

  const findCycle = () => {
    let cycle = [];
    const today = new Date().toString();
    cycle = Array.from(appraisalForm).filter((obj) => {
      const sDate = new Date(obj.startDate.seconds * 1000).toString();
      const eDate = new Date(obj.endDate.seconds * 1000).toString();
      if (formatDate(sDate) <= formatDate(today) && formatDate(eDate) >= formatDate(today)) {
        return obj;
      }
      return null;
    });

    if (cycle.length !== 0) {
      return true;
    }
    return false;
  };

  return (
    <Box>
      <Helmet>
        <title>HRMS | Appraisal Portal</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ pt: 3 }}>
            {findCycle() ? (
              <Button
                value=""
                variant="contained"
                color="secondary"
                onClick={() => setViewForm(!viewForm)}
              >
                {viewForm ? 'View My Appraisals' : 'Submit New Appraisal'}
              </Button>
            ) : <div />}
            <div>&nbsp;</div>
            {viewForm ? <UserAppraisalForm /> : <UserAppraisalList />}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default UserAppraisal;
