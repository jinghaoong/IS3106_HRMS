import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Search as SearchIcon } from 'react-feather';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import './attendance.css';

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import { db } from '../../firebase-config';

const AttendanceListResults = ({ ...rest }) => {
  const [statusView, setStatusView] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [startDateValue, setStartDateValue] = useState('');
  const [endDateValue, setEndDateValue] = useState('');
  const [employees, setEmployees] = useState([]);
  const employeesRef = collection(db, 'users');
  const [attendance, setAttendance] = useState([]);
  const attendanceRef = collection(db, 'attendance');
  const [isEmpLoading, setIsEmpLoading] = useState(false);
  const [isAtdLoading, setIsAtdLoading] = useState(false);

  useEffect(() => {
    setIsEmpLoading(true);
    setIsAtdLoading(true);
    const getEmployees = async () => {
      const data = await getDocs(employeesRef);
      setEmployees(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsEmpLoading(false);
    };
    const getAttendance = async () => {
      const data = await getDocs(attendanceRef);
      setAttendance(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsAtdLoading(false);
    };
    getEmployees();
    getAttendance();
  }, []);

  function findEmployee(uId) {
    const em = Array.from(employees).filter((obj) => {
      console.log(obj.id);
      console.log(uId);
      if (obj.id.toString() === uId.toString()) {
        console.log('ok');
        return obj;
      }
      console.log('no');
      return null;
    });
    return em[0];
  }

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
      const hourMin = formattedTime.toString().split(':').slice(0, 2);
      const newTime = hourMin.join(':');
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

  console.log(startDateValue);
  console.log(endDateValue);

  return (!isEmpLoading && !isAtdLoading) ? (
    <Card {...rest}>
      <Box sx={{ mt: 3 }}>
        <CardContent id="buttons">
          <Box>
            <Button
              sx={{
                mx: 2,
              }}
              value=""
              variant={(statusView === '' || statusView === '0') ? 'contained' : 'outlined'}
              onClick={(event) => { setStatusView(event.target.value); }}
            >
              All
            </Button>
            <Button
              value="1"
              variant={statusView === '1' ? 'contained' : 'outlined'}
              onClick={(event) => { setStatusView(event.target.value); }}
            >
              On Time
            </Button>
            <Button
              sx={{
                mx: 2,
              }}
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
        </CardContent>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search employee"
                variant="outlined"
                onChange={(event) => { setSearchValue(event.target.value); }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Employee
                </TableCell>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Date/Time in
                </TableCell>
                <TableCell>
                  Date/Time out
                </TableCell>
                <TableCell>
                  Hours Worked
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(attendance).filter((val) => {
                if (searchValue === '' || findEmployee(val.id).firstName.toLowerCase().includes(searchValue) || findEmployee(val.id).lastName.toLowerCase().includes(searchValue)) {
                  return val;
                }
                return null;
              }).filter((em) => {
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
                .sort(((a, b) => b.dateTimeIn.seconds - a.dateTimeIn.seconds))
                .map((at) => (
                  <TableRow
                    hover
                    key={at.id}
                  >
                    <TableCell>
                      {findEmployee(at.email).firstName}
                      <span> </span>
                      {findEmployee(at.email).lastName}
                    </TableCell>
                    <TableCell>
                      {at.email}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(at.dateTimeIn.seconds * 1000).toString())}
                      <b>/</b>
                      {formatTime(new Date(at.dateTimeIn.seconds * 1000).toString())}
                    </TableCell>
                    <TableCell>
                      {(at.dateTimeOut.seconds !== at.dateTimeIn.seconds) ? formatDate(new Date(at.dateTimeOut.seconds * 1000).toString()) : ''}
                      <b>/</b>
                      {(at.dateTimeOut.seconds !== at.dateTimeIn.seconds) ? formatTime(new Date(at.dateTimeOut.seconds * 1000).toString()) : ''}
                    </TableCell>
                    <TableCell>
                      {at.normalHours}
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
    </Card>
  ) : (
    <Card>
      <h1> Loading... </h1>
    </Card>
  );
};

export default AttendanceListResults;
