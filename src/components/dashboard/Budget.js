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

const Budget = () => {
  const [employees, setEmployeesPage] = useState([]);
  const [size, setSize] = useState(0);
  const employeesPageRef = (collection(db, 'users'));

  const getEmployees = async () => {
    const data = await getDocs(employeesPageRef);
    setEmployeesPage(data.docs.map((d) => ({ ...d.data(), id: d.id })));
    await getDocs(employeesPageRef).then((snap) => {
      setSize(snap.size); // will return the collection size
    });
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <Card {...employees}>
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
              LATE ATTENDANCES
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

export default Budget;
