import moment from 'moment';
import {
  Avatar,
  Box,
  Typography
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc
}
from 'firebase/firestore';
import { auth, db } from '../../firebase-config';

const AccountProfile = () => {
  const [currUser, setCurrUser] = useState('');
  const [currEmp, setCurrEmp] = useState('');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
      console.log('email is ', currUser.email);
    } else {
      setCurrUser(null);
    }
  });

  useEffect(() => {
    const getEmp = async () => {
      console.log('Print email', currUser.email);
      await getDoc(doc(db, 'users', `${currUser.email}`)).then((docSnap) => {
        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
          setCurrEmp(docSnap.data());
          console.log('Current employee is ', currEmp);
        } else {
          console.log('No such document!');
        }
      });
    };
    getEmp();
  }, []);

  console.log('Testing', currEmp.firstName);

  const profile = {
    avatar: '/static/images/avatars/default_avatar.png',
    firstName: currEmp.firstName,
    lastName: currEmp.lastName,
    identificationNo: currEmp.identificationNo,
    email: currEmp.email,
    contact: currEmp.contact,
    address: currEmp.address,
    role: currEmp.role,
    status: currEmp.status,
    dob: currEmp.dob,
    joined: currEmp.startDate
  };

  const empDOB = profile.dob ? moment(profile.dob.toDate()).calendar() : '';
  const empStart = profile.startDate ? moment(profile.startDate.toDate()).calendar() : '';

  console.log(currEmp.firstName);

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Avatar
        src={profile.avatar}
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
        {`${profile.firstName} ${profile.lastName}`}
      </Typography>
      <Typography
        color="textSecondary"
        variant="body1"
      >
        {profile.identificationNo}
      </Typography>
      <Typography
        color="textSecondary"
        variant="body1"
      >
        {profile.email}
      </Typography>
      <Typography
        color="textSecondary"
        variant="body1"
      >
        {profile.address}
      </Typography>
      <Typography
        color="textSecondary"
        variant="body1"
      >
        {profile.role}
      </Typography>
      <Typography
        color="textSecondary"
        variant="body1"
      >
        {profile.status}
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
  );
};

export default AccountProfile;
