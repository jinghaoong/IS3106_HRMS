import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';
import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';

import { Rating } from 'react-simple-star-rating';
import { auth, db } from '../../firebase-config';

const UserSubmittedAppraisalData = () => {
  const [selectedEmployeesIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [employees, setEmployees] = useState([]);
  const employeesRef = collection(db, 'users');
  const [appraisal, setAppraisal] = useState([]);
  const appraisalRef = collection(db, 'appraisals');
  const [appraisalForm, setAppraisalForm] = useState([]);
  const appraisalFormRef = collection(db, 'appraisalForm');
  const [currUser, setCurrUser] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedAppraiseeId, setSelectedAppraiseeId] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState('');
  const [selectedAppraisalId, setSelectedAppraisalId] = useState('');

  useEffect(() => {
    const getEmployees = async () => {
      const data = await getDocs(employeesRef);
      setEmployees(data.docs.map((val) => ({ ...val.data(), id: val.id })));
    };
    const getAppraisal = async () => {
      const data = await getDocs(appraisalRef);
      setAppraisal(data.docs.map((val) => ({ ...val.data(), id: val.id })));
    };
    const getAppraisalForm = async () => {
      const data = await getDocs(appraisalFormRef);
      setAppraisalForm(data.docs.map((val) => ({ ...val.data(), id: val.id })));
    };
    getEmployees();
    getAppraisal();
    getAppraisalForm();
  }, []);

  console.log('appraisalForms: ', appraisalForm);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrUser(user);
      console.log('logged in as', currUser);
    } else {
      setCurrUser(null);
    }
  });

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

  const getType = (data) => {
    if (data.appraiseeId === data.appraiserId) {
      return 'Self-Evaluation';
    }
    return 'Employee Appraisal';
  };

  const handleOpen = (data) => {
    console.log(data);
    setSelectedAppraiseeId(data.appraiseeId);
    setSelectedRating(data.rating);
    setSelectedFeedback(data.feedback);
    setSelectedAppraisalId(data.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRating = (rate) => {
    setSelectedRating(rate);
  };

  function resetForm() {
    setSelectedAppraiseeId('');
    setSelectedFeedback('');
    setSelectedRating('');
    setSelectedAppraisalId('');
  }

  const handleSubmit = async () => {
    console.log(selectedRating);
    console.log(selectedFeedback);
    const appraisalDoc = doc(db, 'appraisals', selectedAppraisalId);
    const newFields = {
      appraiseeId: selectedAppraiseeId,
      appraiserId: currUser.email,
      rating: selectedRating,
      feedback: selectedFeedback,
      date: new Date()
    };
    await updateDoc(appraisalDoc, newFields);
    setOpen(false);
    window.location.reload(true);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSelectedFeedback(value);
  };

  const getEditable = (dataDate) => {
    let cycle = [];
    const aDate = new Date(dataDate.seconds * 1000).toString();
    cycle = Array.from(appraisalForm).filter((obj) => {
      const sDate = new Date(obj.startDate.seconds * 1000).toString();
      const eDate = new Date(obj.endDate.seconds * 1000).toString();
      if (formatDate(sDate) <= formatDate(aDate) && formatDate(eDate) >= formatDate(aDate)) {
        return obj;
      }
      return null;
    });

    const end = new Date(cycle[0].endDate.seconds * 1000);
    console.log('editable', formatDate(end));
    console.log('today', formatDate(new Date()));
    console.log(end >= new Date());
    if (end.setHours(1) >= new Date().setHours(0)) {
      return true;
    }
    return false;
  };

  const getCycle = (dataDate) => {
    let cycle = [];
    const aDate = new Date(dataDate.seconds * 1000).toString();
    cycle = Array.from(appraisalForm).filter((obj) => {
      const sDate = new Date(obj.startDate.seconds * 1000).toString();
      const eDate = new Date(obj.endDate.seconds * 1000).toString();
      if (formatDate(sDate) <= formatDate(aDate) && formatDate(eDate) >= formatDate(aDate)) {
        return obj;
      }
      return null;
    });

    const start = formatDate(new Date(cycle[0].startDate.seconds * 1000).toString());
    const end = formatDate(new Date(cycle[0].endDate.seconds * 1000).toString());
    return `${start} to ${end}`;
  };

  return (employees.length > 0 && appraisalForm.length > 0 && appraisal.length > 0) ? (
    <Card>
      <CardHeader
        title="View your submitted appraisals"
        titleTypographyProps={{ variant: 'h1' }}
      />
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 125 }}>
                  Appraiser
                </TableCell>
                <TableCell sx={{ width: 125 }}>
                  Date
                </TableCell>
                <TableCell sx={{ width: 250 }}>
                  Appraisal Cycle Period
                </TableCell>
                <TableCell>
                  Type
                </TableCell>
                <TableCell sx={{ width: 25 }}>
                  Rating
                </TableCell>
                <TableCell>
                  Feedback
                </TableCell>
                <TableCell>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(appraisal).slice(0, limit).sort((a, b) => b.date - a.date).filter((obj) => {
                if (obj.appraiserId === currUser.email) {
                  return obj;
                }
                return null;
              })
                .map((data) => (
                  <TableRow
                    hover
                    key={data.id}
                    selected={selectedEmployeesIds.indexOf(data.userId) !== ''}
                  >
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
                      {getType(data)}
                    </TableCell>
                    <TableCell>
                      {data.rating}
                    </TableCell>
                    <TableCell>
                      {data.feedback}
                    </TableCell>
                    <TableCell>
                      {getEditable(data.date) ? (
                        <Button onClick={() => { handleOpen(data); }}>
                          EDIT
                        </Button>
                      ) : (
                        <div />
                      )}
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Appraisal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="appraiseeEmail"
            label="Appraisee Email"
            type="email"
            value={selectedAppraiseeId}
            fullWidth
            disabled
          />
          <Rating
            name="ratings"
            onClick={handleRating}
            ratingValue={selectedRating}
            fillColor="#f1a545"
          />
          <TextField
            autoFocus
            margin="dense"
            id="feedback"
            name="appraiseeFeedback"
            label="Feedback"
            type="text"
            value={selectedFeedback}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Card>
  ) : (
    <Card>
      <h1>
        Loading..
      </h1>
    </Card>
  );
};

export default UserSubmittedAppraisalData;
