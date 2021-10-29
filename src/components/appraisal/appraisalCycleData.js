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

const AppraisalCycleData = ({
  appraisalForm, ...rest
}) => {
  const [selectedAppraisalFormIds] = useState([]);
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

  return (
    <Card {...rest}>
      <Box>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Cycle ID
                  </TableCell>
                  <TableCell>
                    Start Date
                  </TableCell>
                  <TableCell>
                    End Date
                  </TableCell>
                  <TableCell>
                    Self Evaluation?
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(appraisalForm).slice(0, limit).sort((a, b) => b.startDate - a.startDate)
                  .map((data) => (
                    <TableRow
                      hover
                      key={data.id}
                      selected={selectedAppraisalFormIds.indexOf(data.id) !== -1}
                    >
                      <TableCell>
                        {data.id}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(data.startDate.seconds * 1000).toString())}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(data.endDate.seconds * 1000).toString())}
                      </TableCell>
                      <TableCell>
                        {data.selfEval.toString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={appraisalForm.length}
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

AppraisalCycleData.propTypes = {
  appraisalForm: PropTypes.array.isRequired,
};

export default AppraisalCycleData;
