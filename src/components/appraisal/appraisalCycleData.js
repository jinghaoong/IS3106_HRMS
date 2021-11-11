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
} from '@material-ui/core';

const AppraisalCycleData = ({
  appraisalForm, ...rest
}) => {
  const [selectedAppraisalFormIds] = useState([]);

  const formatDate = (date) => {
    if (date !== null) {
      const formattedDate = date.toString().split(' ').slice(1, 4);
      const newDate = formattedDate.join('-');
      return (newDate);
    }
    return '';
  };

  return (appraisalForm.length > 0) ? (
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
                {Array.from(appraisalForm).sort((a, b) => b.startDate - a.startDate)
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
      </Box>
    </Card>
  ) : (
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
                <TableRow>
                  <TableCell>
                    <h1>No records found</h1>
                  </TableCell>
                  <TableCell>
                    <h1> </h1>
                  </TableCell>
                  <TableCell>
                    <h1> </h1>
                  </TableCell>
                  <TableCell>
                    <h1> </h1>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Box>
    </Card>
  );
};

AppraisalCycleData.propTypes = {
  appraisalForm: PropTypes.array.isRequired,
};

export default AppraisalCycleData;
