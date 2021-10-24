import { useState } from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
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
  const [selectedLeaveApplicationsIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectOne = (event, leaveId) => {
    const selectedIndex = selectedLeaveApplicationsIds.indexOf(leaveId);
    let newSelectedLeaveApplicationsIds = [];

    if (selectedIndex === -1) {
      newSelectedLeaveApplicationsIds = newSelectedLeaveApplicationsIds.concat(selectedLeaveApplicationsIds, leaveId);
    } else if (selectedIndex === 0) {
      newSelectedLeaveApplicationsIds = newSelectedLeaveApplicationsIds.concat(selectedLeaveApplicationsIds.slice(1));
    } else if (selectedIndex === selectedLeaveApplicationsIds.length - 1) {
      newSelectedLeaveApplicationsIds = newSelectedLeaveApplicationsIds.concat(selectedLeaveApplicationsIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedLeaveApplicationsIds = newSelectedLeaveApplicationsIds.concat(
        selectedLeaveApplicationsIds.slice(0, selectedIndex),
        selectedLeaveApplicationsIds.slice(selectedIndex + 1)
      );
    }
    selectedLeaveApplicationsIds(newSelectedLeaveApplicationsIds);
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
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(leaveApplications).slice(0, limit).map((leaveApplication) => (
                <TableRow
                  hover
                  key={leaveApplication.leaveId}
                  selected={selectedLeaveApplicationsIds.indexOf(leaveApplication.leaveId) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedLeaveApplicationsIds.indexOf(leaveApplication.leaveId) !== -1}
                      onChange={(event) => handleSelectOne(event, leaveApplication.leaveId)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {leaveApplication.firstName}
                  </TableCell>
                  <TableCell>
                    {leaveApplication.lastName}
                  </TableCell>
                  <TableCell>
                    {leaveApplication.username}
                  </TableCell>
                  <TableCell>
                    {leaveApplication.address}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={leaveApplications.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

LeaveApplicationsResults.propTypes = {
  LeaveApplicationsResults: PropTypes.array.isRequired,
  leaveApplications: PropTypes.array.isRequired
};

export default LeaveApplicationsResults;
