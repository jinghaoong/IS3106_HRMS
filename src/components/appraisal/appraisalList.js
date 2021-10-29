import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import AppraisalData from './appraisalData';
import AppraisalCycleData from './appraisalCycleData';

const AppraisalList = ({
  appraisalForm, appraisal, employees, ...rest
}) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [appraisalCycleView, setAppraisalCycleView] = useState(false);
  // const [selected, setSelected] = useState('');

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleTableChange = () => {
    console.log(appraisalCycleView);
    setAppraisalCycleView(!appraisalCycleView);
  };

  return (employees.length > 0 && appraisal.length > 0 && appraisalForm.length > 0) ? (
    <>
      <Card>
        <Button
          className="switch-btn"
          color="primary"
          variant="contained"
          onClick={() => (handleTableChange())}
        >
          {appraisalCycleView ? 'View Appraisals' : 'View Appraisal Cycles'}
        </Button>
        {!appraisalCycleView ? <AppraisalData appraisal={appraisal} appraisalForm={appraisalForm} employees={employees} /> : <AppraisalCycleData appraisalForm={appraisalForm} />}
      </Card>
    </>
    /* <PerfectScrollbar>
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
                  selected={selectedEmployeesIds.indexOf(data.userId) !== -1}
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
      count={employees.length}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleLimitChange}
      page={page}
      rowsPerPage={limit}
      rowsPerPageOptions={[5, 10, 25]}
    /> */
  ) : (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Appraisal Cycles
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <h1>Loading...</h1>
                </TableCell>
              </TableRow>
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

AppraisalList.propTypes = {
  appraisal: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired,
  appraisalForm: PropTypes.array.isRequired,
};

export default AppraisalList;
