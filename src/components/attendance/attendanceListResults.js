import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Search as SearchIcon } from 'react-feather';
// import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
// import DatePicker from '@material-ui/lab/DatePicker';
// import { DateRangePicker } from 'react-date-range';
import DatePicker from 'react-datepicker';
import './attendance.css';
// import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';

import 'react-datepicker/dist/react-datepicker.css';

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
  TablePagination,
  TableRow,
} from '@material-ui/core';

const AttendanceListResults = ({ attendance, employees, ...rest }) => {
  const [statusView, setStatusView] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [startDateValue, setStartDateValue] = useState('');
  const [endDateValue, setEndDateValue] = useState('');
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  function findEmployee(uId) {
    const em = Array.from(employees).filter((obj) => {
      if (obj.userId === uId) {
        return obj;
      }
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

  // const selectionRange = {
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   key: 'selection',
  // };

  return (employees.length > 0 && attendance.length > 0) ? (
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
              <div className="dateTags"><b>From</b></div>
              <div className="datePick">
                <DatePicker
                  sx={{
                    minHeight: 5,
                    mx: 5,
                    size: 10,
                  }}
                  className="startingCalendar"
                  selected={startDateValue}
                  onChange={(date) => setStartDateValue(date)}
                  value={startDateValue}
                  placeholderText="Search by start date"
                />
              </div>
              <div>&nbsp;</div>
              <div className="dateTags"><b>To</b></div>
              <div className="datePick">
                <DatePicker
                  sx={{
                    minHeight: 5,
                    ml: 5,
                  }}
                  id="ending"
                  className="endingCalendar"
                  selected={endDateValue}
                  onChange={(date) => setEndDateValue(date)}
                  value={endDateValue}
                  placeholderText="Search by end date"
                />
              </div>
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
                  Overtime Hours
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(attendance).slice(0, limit).filter((val) => {
                if (searchValue === '' || findEmployee(val.userId).firstName.toLowerCase().includes(searchValue) || findEmployee(val.userId).lastName.toLowerCase().includes(searchValue)) {
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
                // .map((obj) => {
                //   return obj.normalHours = obj.timeOut - obj.timeIn;
                // })
                .sort(((a, b) => b.dateTimeIn.seconds - a.dateTimeIn.seconds))
                .map((at) => (
                  <TableRow
                    hover
                    key={at.id}
                    selected={selectedEmployeesIds.indexOf(at.userId) !== -1}
                  >
                    <TableCell>
                      {findEmployee(at.userId).firstName}
                    </TableCell>
                    <TableCell>
                      {at.userId}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(at.dateTimeIn.seconds * 1000).toString())}
                      <b>/</b>
                      {formatTime(new Date(at.dateTimeIn.seconds * 1000).toString())}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(at.dateTimeOut.seconds * 1000).toString())}
                      <b>/</b>
                      {formatTime(new Date(at.dateTimeOut.seconds * 1000).toString())}
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
      <h1> Loading... </h1>
    </Card>
  );
};

AttendanceListResults.propTypes = {
  attendance: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired
};

export default AttendanceListResults;
