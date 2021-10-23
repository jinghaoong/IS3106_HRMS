import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';

const LeaveApplicationsResults = ({ leaveApplications, ...rest }) => {
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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
    selectedEmployeesIds(newSelectedEmployeesIds);
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

export default LeaveApplicationsResults;
