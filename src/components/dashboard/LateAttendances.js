import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from 'src/firebase-config';
import { red } from '@material-ui/core/colors';
import MoneyIcon from '@material-ui/icons/Money';

const LateAttendances = () => {
  const [attendance, setAttendance] = useState([]);
  const [size, setSize] = useState(0);
  const attendanceRef = (collection(db, 'attendance'));

  function getSize() {
    const arr = Array.from(attendance).filter((obj) => {
      const today = new Date();
      const date = new Date(obj.dateTimeIn.seconds * 1000);
      const now = today.toString().split(' ').slice(1, 4).join('-');
      const dateIn = date.toString().split(' ').slice(1, 4).join('-');
      if (now === dateIn) {
        const formattedTime = date.toString().split(' ').slice(4, 5);
        const hourMinSec = formattedTime.toString().split(':').slice(0, 3);
        const newTime = hourMinSec.join(':');
        if (newTime > '09:00:00') {
          return obj;
        }
      }
      return null;
    });
    setSize(arr.length);
  }

  const getAttendance = async () => {
    const data = await getDocs(attendanceRef);
    setAttendance(data.docs.map((d) => ({ ...d.data(), id: d.id })));
    await getDocs(attendanceRef).then(() => {
      getSize();
    });
    // .then((snap) => {
    //   setSize(snap.size); // will return the collection size
    // });
  };

  useEffect(() => {
    getAttendance();
  }, []);

  return (
    <Card {...attendance}>
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              TODAY ATTENDANCES
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {size}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: red[600],
                height: 56,
                width: 56
              }}
            >
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LateAttendances;
