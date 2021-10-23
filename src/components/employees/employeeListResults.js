import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Search as SearchIcon } from 'react-feather';
// import Moment from 'moment';

import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import moment from 'moment';

const EmployeeListResults = ({ employees, ...rest }) => {
  console.log('Current number of employees: ', employees.length);
  const [statusView] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  // const [date, setDate] = useState(new Date());

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <Box sx={{ mt: 3 }}>
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
                  Employee ID
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Role
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
                  Joined On
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.slice(0, limit).filter((val) => {
                if (searchValue === '') {
                  return val;
                }
                if (searchValue !== '') {
                  const searchVal = searchValue.toLowerCase();
                  const fullName = (`${val.lastName} ${val.firstName}`) && (`${val.lastName} ${val.firstName}`).toLowerCase().includes(searchVal);
                  console.log(fullName);
                  const firstName = val.firstName && val.firstName.toLowerCase().includes(searchVal);
                  const lastName = val.lastName && val.lastName.toLowerCase().includes(searchVal);
                  return fullName || firstName || lastName;
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
                      {employee.id}
                    </TableCell>
                    <TableCell>
                      {employee.lastName}
                      {' '}
                      {employee.firstName}
                    </TableCell>
                    <TableCell>
                      {employee.role}
                    </TableCell>
                    <TableCell>
                      {employee.contact}
                    </TableCell>
                    <TableCell>
                      {employee.email}
                    </TableCell>
                    <TableCell>
                      {moment(employee.dob).format('DD MMM YYYY')}
                    </TableCell>
                    <TableCell>
                      {moment(employee.joined).format('DD MMM YYYY')}
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
  employees: PropTypes.array.isRequired,
  EmployeeListResults: PropTypes.array.isRequired,
  employee: PropTypes.array.isRequired,
};

export default EmployeeListResults;
