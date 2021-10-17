import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import getInitials from '../../utils/getInitials';

const EmployeesListResults = ({ employees, ...rest }) => {
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  // const handleSelectAll = (event) => {
  //   let newSelectedEmployeesIds;

  //   if (event.target.checked) {
  //     newSelectedEmployeesIds = employees.map((employee) => employee.id);
  //   } else {
  //     newSelectedEmployeesIds = [];
  //   }

  //   setSelectedEmployeesIds(newSelectedEmployeesIds);
  // };

  // const handleSelectOne = (event, id) => {
  //   const selectedIndex = selectedEmployeesIds.indexOf(id);
  //   let newSelectedEmployeesIds = [];

  //   if (selectedIndex === -1) {
  //     newSelectedEmployeesIds = newSelectedEmployeesIds.concat(selectedEmployeesIds, id);
  //   } else if (selectedIndex === 0) {
  //     newSelectedEmployeesIds = newSelectedEmployeesIds.concat(selectedEmployeesIds.slice(1));
  //   } else if (selectedIndex === selectedEmployeesIds.length - 1) {
  //     newSelectedEmployeesIds = newSelectedEmployeesIds.concat(selectedEmployeesIds.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelectedEmployeesIds = newSelectedEmployeesIds.concat(
  //       selectedEmployeesIds.slice(0, selectedIndex),
  //       selectedEmployeesIds.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedEmployeesIds(newSelectedEmployeesIds);
  // };

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
              {employees.slice(0, limit).map((employee) => (
                <TableRow
                  hover
                  key={employee.id}
                  selected={selectedEmployeesIds.indexOf(employee.id) !== -1}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={employee.avatarUrl}
                        sx={{ mr: 2 }}
                      >
                        {getInitials(employee.name)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {employee.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {employee.id}
                  </TableCell>
                  <TableCell>
                    {`${employee.address.city}, ${employee.address.state}, ${employee.address.country}`}
                  </TableCell>
                  <TableCell>
                    {employee.phone}
                  </TableCell>
                  <TableCell>
                    {moment(employee.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(employee.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(employee.createdAt).format('DD/MM/YYYY')}
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

EmployeesListResults.propTypes = {
  employees: PropTypes.array.isRequired
};

export default EmployeesListResults;
