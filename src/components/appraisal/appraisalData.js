import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from '@material-ui/core';

const AppraisalData = ({
  appraisalForm, appraisal, employees, ...rest
}) => {
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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
      if (obj.id === uId) {
        return obj;
      }
      return null;
    });
    return em[0];
  }

  const getCycle = (dataDate) => {
    const cycle = Array.from(appraisalForm).filter((obj) => {
      if ((formatDate(new Date(obj.startDate.seconds * 1000))) <= (formatDate(new Date(dataDate.seconds * 1000)))
        && (formatDate(new Date(obj.endDate.seconds * 1000))) >= (formatDate(new Date(dataDate.seconds * 1000)))) {
        console.log(obj);
        return obj;
      }
      return null;
    });
    console.log(cycle[0]);
    if (cycle.length !== 0) {
      const start = formatDate(new Date(cycle[0].startDate.seconds * 1000).toString());
      const end = formatDate(new Date(cycle[0].endDate.seconds * 1000).toString());
      return `${start} to ${end}`;
    }
    return '';
  };

  return (
    <Card {...rest}>
      <Box>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Appraiser
                  </TableCell>
                  <TableCell>
                    Appraisee
                  </TableCell>
                  <TableCell>
                    Date
                  </TableCell>
                  <TableCell>
                    Appraisal Cycle Period
                  </TableCell>
                  <TableCell>
                    Rating
                  </TableCell>
                  <TableCell>
                    Feedback
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(appraisal).slice(0, limit).sort((a, b) => b.date - a.date)
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
                        {findEmployee(data.appraiseeId).lastName}
                        <span> </span>
                        {findEmployee(data.appraiseeId).firstName}
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
          count={appraisal.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </Card>
  );
};

AppraisalData.propTypes = {
  appraisal: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired,
  appraisalForm: PropTypes.array.isRequired,
};

export default AppraisalData;