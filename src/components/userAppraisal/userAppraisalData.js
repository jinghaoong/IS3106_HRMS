import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';

import { auth, db } from '../../firebase-config';

const UserAppraisalData = () => {
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [employees, setEmployees] = useState([]);
  const employeesRef = collection(db, 'users');
  const [appraisal, setAppraisal] = useState([]);
  const appraisalRef = collection(db, 'appraisals');
  const [appraisalForm, setAppraisalForm] = useState([]);
  const appraisalFormRef = collection(db, 'appraisalForm');
  const [currUser, setCurrUser] = useState([]);

  useEffect(() => {
    const getEmployees = async () => {
      const data = await getDocs(employeesRef);
      setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getAppraisal = async () => {
      const data = await getDocs(appraisalRef);
      setAppraisal(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getAppraisalForm = async () => {
      const data = await getDocs(appraisalFormRef);
      setAppraisalForm(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getEmployees();
    getAppraisal();
    getAppraisalForm();
  }, []);

  console.log('appraisalForms: ', appraisalForm);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
    } else {
      setCurrUser(null);
    }
  });

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const formatDate = (date) => {
    if (date !== null) {
      const formattedDate = date.toString().split(' ').slice(1, 4);
      const newDate = formattedDate.join('-');
      return (newDate);
    }
    return '';
  };

  function findEmployee(uId) {
    const em = Array.from(employees).filter((obj) => {
      if (obj.email === uId) {
        return obj;
      }
      return null;
    });
    return em[0];
  }

  const getCycle = (dataDate) => {
    let cycle = [];
    const aDate = new Date(dataDate.seconds * 1000).toString();
    cycle = Array.from(appraisalForm).filter((obj) => {
      const sDate = new Date(obj.startDate.seconds * 1000).toString();
      const eDate = new Date(obj.endDate.seconds * 1000).toString();
      console.log(formatDate(sDate) <= formatDate(aDate) && formatDate(eDate) >= formatDate(aDate));
      if (formatDate(sDate) <= formatDate(aDate) && formatDate(eDate) >= formatDate(aDate)) {
        return obj;
      }
      return null;
    });

    const start = formatDate(new Date(cycle[0].startDate.seconds * 1000).toString());
    const end = formatDate(new Date(cycle[0].endDate.seconds * 1000).toString());
    return `${start} to ${end}`;
  };

  return (employees.length > 0 && appraisalForm.length > 0 && appraisal.length > 0) ? (
    <Card>
      <CardHeader
        title="View your appraisals"
        titleTypographyProps={{ variant: 'h1' }}
      />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 125 }}>
                  Appraiser
                </TableCell>
                <TableCell sx={{ width: 125 }}>
                  Date
                </TableCell>
                <TableCell sx={{ width: 250 }}>
                  Appraisal Cycle Period
                </TableCell>
                <TableCell sx={{ width: 25 }}>
                  Rating
                </TableCell>
                <TableCell>
                  Feedback
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(appraisal).slice(0, limit).sort((a, b) => b.date - a.date).filter((obj) => {
                console.log('obj id as ', obj.appraiseeId);
                console.log('currUser email  as ', currUser.email);
                if (obj.appraiseeId === currUser.email) {
                  return obj;
                }
                return null;
              })
                .map((data) => (
                  <TableRow
                    hover
                    key={data.id}
                    selected={selectedEmployeesIds.indexOf(data.userId) !== ''}
                  >
                    <TableCell>
                      {findEmployee(data.appraiserId).lastName}
                      <span> </span>
                      {findEmployee(data.appraiserId).firstName}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(data.date.seconds * 1000).toString())}
                    </TableCell>
                    <TableCell>
                      {getCycle(data.date)}
                    </TableCell>
                    <TableCell>
                      {data.rating}
                    </TableCell>
                    <TableCell>
                      {data.feedback}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={employees.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  ) : (
    <Card>
      <h1>
        Loading..
      </h1>
    </Card>
  );
};

export default UserAppraisalData;
