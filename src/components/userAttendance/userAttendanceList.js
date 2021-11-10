import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import {
  Box,
  Button,
  TextField,
  Chip,
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

const UserAttendanceList = () => {
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [employees, setEmployees] = useState([]);
  const employeesRef = collection(db, 'users');
  const [attendance, setAttendance] = useState([]);
  const attendanceRef = collection(db, 'attendance');
  const [currUser, setCurrUser] = useState([]);
  const [statusView, setStatusView] = useState('');
  const [startDateValue, setStartDateValue] = useState('');
  const [endDateValue, setEndDateValue] = useState('');

  useEffect(() => {
    const getEmployees = async () => {
      const data = await getDocs(employeesRef);
      setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    const getAttendance = async () => {
      const data = await getDocs(attendanceRef);
      setAttendance(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getEmployees();
    getAttendance();
  }, []);

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

  const formatTime = (date) => {
    if (date !== null) {
      const formattedTime = date.toString().split(' ').slice(4, 5);
      const hourMinSec = formattedTime.toString().split(':').slice(0, 3);
      const newTime = hourMinSec.join(':');
      return (newTime);
    }
    return '';
  };

  const getStatus = (timeIn) => {
    if (formatTime(timeIn) > '09:00:00') {
      return 2;
    }
    return 1;
  };

  return (employees.length > 0 && attendance.length > 0) ? (
    <Card>
      <CardHeader
        title="View your attendance"
        titleTypographyProps={{ variant: 'h1' }}
      />
      <PerfectScrollbar>
        <Box sx={{ p: 3 }}>
          <Button
            value=""
            variant={(statusView === '' || statusView === '0') ? 'contained' : 'outlined'}
            onClick={(event) => { setStatusView(event.target.value); }}
          >
            All
          </Button>
          <Button
            sx={{
              mx: 2
            }}
            value="1"
            variant={statusView === '1' ? 'contained' : 'outlined'}
            onClick={(event) => { setStatusView(event.target.value); }}
          >
            On Time
          </Button>
          <Button
            value="2"
            variant={statusView === '2' ? 'contained' : 'outlined'}
            onClick={(event) => { setStatusView(event.target.value); }}
          >
            Late
          </Button>
          <div>&nbsp;</div>
          <Box className="pickers">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Search by start date"
                className="datepicker"
                format="dd/MM/yyyy"
                value={startDateValue}
                clearable
                maxDate={new Date()}
                onChange={(date) => {
                  setStartDateValue(date);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <div>&nbsp;</div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Search by end date"
                className="datepicker"
                format="dd/MM/yyyy"
                value={endDateValue}
                clearable
                maxDate={new Date()}
                onChange={(date) => {
                  setEndDateValue(date);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </Box>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Time in
                </TableCell>
                <TableCell>
                  Time out
                </TableCell>
                <TableCell>
                  Hours Worked
                </TableCell>
                <TableCell>
                  Overtime Hours
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(attendance).slice(0, limit).filter((em) => {
                if (statusView === '' || getStatus(new Date(em.dateTimeIn.seconds * 1000).toString()).toString() === statusView) {
                  return em;
                }
                return null;
              })
                .filter((obj) => {
                  if ((startDateValue === null && endDateValue === null)
                    || (formatDate(startDateValue) <= formatDate(new Date(obj.dateTimeIn.seconds * 1000).toString()) && endDateValue === '')
                    || (formatDate(endDateValue) >= formatDate(new Date(obj.dateTimeIn.seconds * 1000).toString()) && startDateValue === '')
                    || (formatDate(startDateValue) <= formatDate(new Date(obj.dateTimeIn.seconds * 1000).toString()) && formatDate(endDateValue) >= formatDate(new Date(obj.dateTimeIn.seconds * 1000).toString()))) {
                    return obj;
                  }
                  return null;
                })
                .filter((data) => {
                  if (data.email === currUser.email) {
                    return data;
                  }
                  return null;
                })
                .sort(((a, b) => b.dateTimeIn.seconds - a.dateTimeIn.seconds))
                .map((at) => (
                  <TableRow
                    hover
                    key={at.userId}
                    selected={selectedEmployeesIds.indexOf(at.userId) !== ''}
                  >
                    <TableCell>
                      {formatDate(new Date(at.dateTimeIn.seconds * 1000).toString())}
                    </TableCell>
                    <TableCell>
                      {formatTime(new Date(at.dateTimeIn.seconds * 1000).toString())}
                    </TableCell>
                    <TableCell>
                      {(at.dateTimeOut.seconds !== at.dateTimeIn.seconds) ? formatTime(new Date(at.dateTimeOut.seconds * 1000).toString()) : ''}
                    </TableCell>
                    <TableCell>
                      {at.normalHours}
                    </TableCell>
                    <TableCell>
                      {at.overtimeHours}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatus(new Date(at.dateTimeIn.seconds * 1000).toString()) === 1 ? 'On Time' : 'Late'}
                        color={getStatus(new Date(at.dateTimeIn.seconds * 1000).toString()) === 1 ? 'success' : 'error'}
                      />
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

export default UserAttendanceList;