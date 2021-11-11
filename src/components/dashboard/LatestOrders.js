import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from '@firebase/firestore';
import { db } from 'src/firebase-config';

const LatestOrders = () => {
  const [employees, setEmployeesPage] = useState([]);
  const employeesPageRef = (collection(db, 'users'));

  const getEmployees = async () => {
    const data = await getDocs(employeesPageRef);
    setEmployeesPage(data.docs.map((d) => ({ ...d.data(), id: d.id })));
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <Card {...employees}>
      <CardHeader title="All Employees" />
      <Divider />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Employee ID
                </TableCell>
                <TableCell>
                  Employee Name
                </TableCell>
                <TableCell>
                  Joined On
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  hover
                  key={employee.id}
                >
                  <TableCell>
                    {employee.id}
                  </TableCell>
                  <TableCell>
                    {employee.firstName}
                  </TableCell>
                  <TableCell>
                    {moment(employee.startDate.toDate()).calendar()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color="primary"
                      label={employee.status}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Link to="/app/employees">
          <Button>View All</Button>
        </Link>
      </Box>
    </Card>
  );
};

export default LatestOrders;
