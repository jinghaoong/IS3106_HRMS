import { Helmet } from 'react-helmet';
// import { PropTypes } from 'prop-types';
import { Box, Container } from '@material-ui/core';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { db } from 'src/firebase-config';

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
    { field: 'id', headerName: 'ID', },
    { field: 'basic', headerName: 'Basic', },
    { field: 'overtime', headerName: 'Overtime', },
    { field: 'payment', headerName: 'paymentMode', },
  ];

  const rows = payroll;

  console.log(payroll);
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
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

/*
Payroll.propTypes = {
  payroll: PropTypes.array.isRequired
};
*/

export default Payroll;
