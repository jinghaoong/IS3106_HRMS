import {
  collection,
  getDocs,
  query,
  where
} from '@firebase/firestore';
import {
  Box, Button, Card,
  CardActions,
  CardContent, Container, Typography
} from '@material-ui/core';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import UserPayslipDetails from '../components/payroll/UserPayslipDetails';
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

  // const [selectedPayslip, setPayslip] = useState();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    getPayroll();
    setOpen(false);
  };

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
              <>
                <Card key={payslip.id}>
                  <CardContent>
                    <Typography>
                      Payslip ID:&nbsp;
                      {payslip.id}
                    </Typography>
                    <Typography>
                      Pay: $
                      {payslip.basic + payslip.overtime + payslip.cpfEmployee + payslip.cpfEmployer}
                    </Typography>
                    <Typography>
                      Payment Date:&nbsp;
                      {format(payslip.endDate.toDate(), 'dd MMMM yyyy')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => {
                      handleClickOpen();
                    }}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
                <UserPayslipDetails payslip={payslip} open={open} handleClose={handleClose} />
              </>
            ))}
        </Container>
      </Box>
    </>
  );
};

export default UserPayroll;
