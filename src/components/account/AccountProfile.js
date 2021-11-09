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
  const [currUser, setCurrUser] = useState([]);
  const [currEmp, setCurrEmp] = useState([]);

  const profileVal = {
    avatar: '/static/images/avatars/default_avatar.png',
    firstName: '',
    lastName: '',
    identificationNo: '',
    email: '',
    contact: '',
    address: '',
    role: '',
    status: '',
    dob: '',
    joined: ''
  };

  const [profile, setProfile] = useState(profileVal);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
    } else {
      setCurrUser(null);
    }
  });

  const getEmp = async () => {
    await getDoc(doc(db, 'users', `${currUser.email}`)).then((docSnap) => {
      if (docSnap.exists()) {
        const newData = docSnap.data();
        setCurrEmp(newData);
        setProfile({
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
          startDate: currEmp.startDate
        });
      }
    });
  };

  useEffect(() => {
    getEmp();
  }, [currUser, currEmp]);

  const empDOB = profile.dob ? moment(profile.dob.toDate()).calendar() : '';
  const empStart = profile.startDate ? moment(profile.startDate.toDate()).calendar() : '';

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
        variant="h3"
      >
        {`${profile.firstName} ${profile.lastName}`}
      </Typography>
      <Typography
        color="textPrimary"
        gutterBottom
        variant="h5"
      >
        {`${profile.role}`}
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
        {profile.status}
      </Typography>
      <Typography
        color="textSecondary"
        variant="body1"
      >
        Date of Birth:&nbsp;
        {empDOB}
      </Typography>
      <Typography
        color="textSecondary"
        variant="body1"
      >
        Joined On:&nbsp;
        {empStart}
      </Typography>
    </Box>
  );
};

export default AccountProfile;
