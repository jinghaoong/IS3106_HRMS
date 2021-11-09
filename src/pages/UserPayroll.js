import {
  collection,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import {
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  Container,
  // List,
  // ListItem,
  // ListItemText
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { auth, db } from '../firebase-config';

const UserPayroll = () => {
  const user = auth.currentUser;
  const [payroll, setPayroll] = useState([]);
  const payrollRef = collection(db, 'payroll');

  const {
    email,
    // ...rest
  } = user;

  const getPayroll = async () => {
    const q = query(payrollRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    setPayroll(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    getPayroll();
  }, []);

  return (
    <>
      <Helmet>
        <title>Employee Payroll</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.dark',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container>
          {payroll.length === 0
            && (
              <Card>
                <CardContent>
                  <Typography>
                    No Payroll Found
                  </Typography>
                </CardContent>
              </Card>
            )}
          {payroll
            && payroll.map((payslip) => (
              <Card key={payslip.id}>
                <CardContent>
                  <Typography>
                    {payslip.id}
                  </Typography>
                  <Typography>
                    {payslip.basic}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button>Export</Button>
                </CardActions>
              </Card>
            ))}
        </Container>
      </Box>
    </>
  );
};

export default UserPayroll;
