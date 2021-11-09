import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import {
  Button,
  Card,
} from '@material-ui/core';

import { auth } from '../../firebase-config';
import UserAppraisalData from './userAppraisalData';
import UserSubmittedAppraisalData from './userSubmittedAppraisalData';

const UserAppraisalList = () => {
  const [currUser, setCurrUser] = useState([]);
  const [changeTable, setChangeTable] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
    } else {
      setCurrUser(null);
    }
  });

  const handleTableChange = () => {
    console.log(changeTable);
    setChangeTable(!changeTable);
  };

  return (
    <>
      <Card>
        <Button
          className="switch-btn"
          color="primary"
          variant="contained"
          onClick={() => (handleTableChange())}
        >
          {changeTable ? 'View My Appraisals' : 'View My Submitted Appraisals'}
        </Button>
        {changeTable ? <UserSubmittedAppraisalData /> : <UserAppraisalData />}
      </Card>
    </>
  );
};

export default UserAppraisalList;
