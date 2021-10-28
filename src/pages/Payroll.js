import { Helmet } from 'react-helmet';
// import { PropTypes } from 'prop-types';
import { Box, Container } from '@material-ui/core';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../firebase-config';

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const payrollRef = (collection(db, 'payroll'));

  useEffect(() => {
    const getPayroll = async () => {
      const data = await getDocs(payrollRef);
      setPayroll(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPayroll();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 130 },
    { field: 'basic', headerName: 'Basic', width: 130 },
    { field: 'overtime', headerName: 'Overtime', width: 150 },
    { field: 'paymentMode', headerName: 'Payment Mode', width: 200 },
    { field: 'cpfEmployee', headerName: 'CPF (Employee)', width: 200, },
    { field: 'cpfEmployer', headerName: 'CPF (Employer)', width: 200 },
  ];

  const rows = payroll;

  return (
    <>
      <Helmet>
        <title>Payroll</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <div style={{ height: 800, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
              />
            </div>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Payroll;
