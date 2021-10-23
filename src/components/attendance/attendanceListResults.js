import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Search as SearchIcon } from 'react-feather';
// import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
// import DatePicker from '@material-ui/lab/DatePicker';

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  // Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';

const AttendanceListResults = ({ employees, ...rest }) => {
  console.log(employees);
  const [statusView, setStatusView] = useState('');
  const [searchValue, setSearchValue] = useState('');
  // const [dateValue, setDateValue] = useState('');
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // const formatDate = (date) => {
  //   if (date !== null) {
  //     const formattedDate = date.toString().split(' ').slice(1, 4);
  //     const newDate = formattedDate.join(' ');
  //     return (newDate);
  //   }
  //   return '';
  // };

  return (
    <Card {...rest}>
      <Box sx={{ mt: 3 }}>
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
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Search by date"
              format="dd/MM/yyyy"
              value={dateValue}
              clearable
              maxDate={new Date()}
              onChange={(date) => {
                setDateValue(formatDate(date));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider> */}
        </Box>
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
              {Array.from(employees).slice(0, limit).filter((val) => {
                if (searchValue === '' || val.firstName.toLowerCase().includes(searchValue) || val.lastName.toLowerCase().includes(searchValue)) {
                  return val;
                }
                return null;
              }).filter((em) => {
                if (statusView === '' || em.status.toString() === statusView) {
                  return em;
                }
                return null;
              })
                .map((employee) => (
                  <TableRow
                    hover
                    key={employee.id}
                    selected={selectedEmployeesIds.indexOf(employee.userId) !== -1}
                  >
                    <TableCell>
                      {employee.firstName}
                    </TableCell>
                    <TableCell>
                      {employee.firstName}
                    </TableCell>
                    <TableCell>
                      {employee.firstName}
                    </TableCell>
                    <TableCell>
                      {employee.firstName}
                    </TableCell>
                    <TableCell>
                      {employee.firstName}
                    </TableCell>
                    <TableCell>
                      {employee.firstName}
                    </TableCell>
                    {/* <TableCell>
                      <Chip
                        label={employee.status === 1 ? 'On Time' : 'Late'}
                        color={employee.status === 1 ? 'success' : 'error'}
                      />
                    </TableCell> */}
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
  );
};

AttendanceListResults.propTypes = {
  employees: PropTypes.array.isRequired
};
/*
const EmployeeListResults = ({ employees, ...rest }) => {
  const [selectedEmployeesIds, setSelectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedEmployeesIds;

    if (event.target.checked) {
      newSelectedEmployeesIds = employees.map((employee) => employee.userId);
    } else {
      newSelectedEmployeesIds = [];
    }

    setSelectedEmployeesIds(newSelectedEmployeesIds);
  };

  const handleSelectOne = (event, userId) => {
    const selectedIndex = selectedEmployeesIds.indexOf(userId);
    let newSelectedEmployeesIds = [];

    if (selectedIndex === -1) {
      newSelectedEmployeesIds = newSelectedEmployeesIds.concat(selectedEmployeesIds, userId);
    } else if (selectedIndex === 0) {
      newSelectedEmployeesIds = newSelectedEmployeesIds.concat(selectedEmployeesIds.slice(1));
    } else if (selectedIndex === selectedEmployeesIds.length - 1) {
      newSelectedEmployeesIds = newSelectedEmployeesIds.concat(selectedEmployeesIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedEmployeesIds = newSelectedEmployeesIds.concat(
        selectedEmployeesIds.slice(0, selectedIndex),
        selectedEmployeesIds.slice(selectedIndex + 1)
      );
    }

    setSelectedEmployeesIds(newSelectedEmployeesIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedEmployeesIds.length === employees.length}
                    color="primary"
                    indeterminate={
                      selectedEmployeesIds.length > 0
                      && selectedEmployeesIds.length < employees.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  First Name
                </TableCell>
                <TableCell>
                  Last Name
                </TableCell>
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  Address
                </TableCell>
                <TableCell>
                  Contact
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  DOB
                </TableCell>
                <TableCell>
                  Joined
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(employees).slice(0, limit).map((employee) => (
                <TableRow
                  hover
                  key={employee.userId}
                  selected={selectedEmployeesIds.indexOf(employee.userId) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedEmployeesIds.indexOf(employee.userId) !== -1}
                      onChange={(event) => handleSelectOne(event, employee.userId)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {employee.firstName}
                  </TableCell>
                  <TableCell>
                    {employee.lastName}
                  </TableCell>
                  <TableCell>
                    {employee.username}
                  </TableCell>
                  <TableCell>
                    {employee.address}
                  </TableCell>
                  <TableCell>
                    {employee.contact}
                  </TableCell>
                  <TableCell>
                    {employee.email}
                  </TableCell>
                  <TableCell>
                    {moment(employee.dob).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(employee.startDate).format('DD/MM/YYYY')}
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
  );
};

EmployeeListResults.propTypes = {
  employees: PropTypes.array.isRequired
};

*/
export default AttendanceListResults;
