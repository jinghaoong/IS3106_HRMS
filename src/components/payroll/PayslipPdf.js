import { doc, getDoc } from '@firebase/firestore';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import {
  PDFViewer
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase-config';
import PayslipDocument from './PayslipDocument';

const PayslipPdf = ({ payslip, open, handleClose }) => {
  const startDate = format(payslip.startDate.toDate(), 'dd-MM-yyyy');
  const endDate = format(payslip.endDate.toDate(), 'dd-MM-yyyy');
  const [employee, setEmployee] = useState();
  const employeeRef = doc(db, 'users', payslip.email);

  const manager = auth.currentUser;
  console.log(manager);

  const getEmployee = async () => {
    const docSnap = await getDoc(employeeRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(data);
      setEmployee(data);
    } else {
      console.log('No data');
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="800">
      <DialogTitle>
        <div>
          Print Payslip: &ldquo;
          {payslip.id}
          &ldquo;
        </div>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            with: '100%',
            height: '100%',
            justifyContent: 'center'
          }}
        >
          <PDFViewer width="500" height="800">
            <PayslipDocument employee={employee} payslip={payslip} startDate={startDate} endDate={endDate} />
          </PDFViewer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

PayslipPdf.propTypes = {
  payslip: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default PayslipPdf;
