import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View
} from '@react-pdf/renderer';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PropTypes } from 'prop-types';
import { doc, getDoc } from '@firebase/firestore';
import { auth, db } from '../../firebase-config';

const PayslipPdf = ({ payslip, open, handleClose }) => {
  const styles = StyleSheet.create({
    page: {
      fontSize: 16,
      flexDirection: 'column',
      marginTop: 16,
      marginBottom: 16,
      marginLeft: 16,
      marginRight: 16,
    },
    titleContainer: {
      fontSize: 24,
      marginBottom: 15,
    },
    title: {
      fontWeight: 'bold',
    },
    headerContainer: {
      flexDirection: 'row',
      width: '70%',
      marginBottom: 5,
    },
    headerTitle: {
      width: '40%',
    },
    headerInput: {
      width: '60%'
    },
    tableContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '80%',
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
    row: {
      border: '1',
      flexDirection: 'row',
      alignItems: 'center'
    },
    description: {
      borderRight: '1',
      width: '50%',
    },
    xyz: {
      width: '50%',
    },
    remarksContainer: {
      width: '100%',
      marginBottom: 15,
    },
    signatureContainer: {
      width: '80%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    signature: {
      width: '50%',
    },
  });

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

  const PayslipDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>COMPANY PAYSLIP</Text>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Employee Name</Text>
          <Text style={styles.headerInput}>
            {employee && employee.firstName}
            &nbsp;
            {employee && employee.lastName}
          </Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Employee Email</Text>
          <Text style={styles.headerInput}>{payslip.email}</Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Payment Mode</Text>
          <Text style={styles.headerInput}>{payslip.paymentMode}</Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Payment Date</Text>
          <Text style={styles.headerInput}>
            {startDate}
            &nbsp;to&nbsp;
            {endDate}
          </Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.row}>
            <Text style={styles.description}>Basic</Text>
            <Text style={styles.xyz}>{payslip.basic}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>CPF</Text>
            <Text style={styles.xyz}>{payslip.cpfEmployee + payslip.cpfEmployer}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Overtime</Text>
            <Text style={styles.xyz}>{payslip.overtime > 0 ? payslip.overtime : 0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.description}>Total</Text>
            <Text style={styles.xyz}>{payslip.basic + payslip.cpfEmployee + payslip.cpfEmployer + payslip.overtime}</Text>
          </View>
        </View>

        <View style={styles.remarksContainer}>
          <Text>Remarks:</Text>
          <Text>{payslip.remarks}</Text>
        </View>

        <View style={styles.signatureContainer}>
          <Text style={styles.signature}>Employer:  _________________</Text>
          <Text style={styles.signature}>Employee:  _________________</Text>
        </View>

      </Page>
    </Document>
  );

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
            <PayslipDocument />
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
