import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import QRCode from 'react-qr-code';

import { auth } from '../../firebase-config';

const UserAttendanceScanner = () => {
  const [currUser, setCurrUser] = useState('');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
    } else {
      setCurrUser(null);
    }
  });

  return (
    <>
      <QRCode value="http://google.com" />
    </>
  );
};

export default UserAttendanceScanner;
