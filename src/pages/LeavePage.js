// import { PropTypes } from 'prop-types'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton
} from '@material-ui/core';
import {
  Add as AddIcon, Block as BlockIcon, CheckCircle as CheckCircleIcon, MoreVert as MoreIcon
} from '@mui/icons-material';
import {
  DataGrid,
  GridToolbar
} from '@mui/x-data-grid';
import {
  collection,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { db } from '../firebase-config';
import LeaveForm from '../components/leave/LeaveForm';

const LeavePage = () => {
  const [leave, setLeave] = useState([]);
  const leaveRef = (collection(db, 'leave'));

  const getLeave = async () => {
    const data = await getDocs(leaveRef);
    setLeave(data.docs.map((d) => ({ ...d.data(), id: d.id })));
  };

  useEffect(() => {
    getLeave();
  }, []);

  const [leaveRequest, setLeaveRequest] = useState([]);
  const [dialogType, setDialogType] = useState('create');

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    getLeave();
    setOpen(false);
  };

  const updateLeaveRequest = async (temp) => {
    const updateRef = doc(db, 'leave', temp.id);
    updateDoc(updateRef, { approved: !temp.approved })
      .then(getLeave());
  };

  const CreateButton = () => (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => {
        setDialogType('create');
        setLeaveRequest([]);
        handleClickOpen();
      }}
    >
      New Leave Request
    </Button>
  );

  const actionsButtonGroup = (params) => (
    <ButtonGroup>
      <IconButton
        title="View Details"
        onClick={() => {
          setDialogType('view');
          setLeaveRequest(params.row);
          handleClickOpen();
        }}
      >
        <MoreIcon />
      </IconButton>
      <IconButton
        title="Approve Leave Request"
        disabled={params.row.approved}
        onClick={() => {
          console.log('Approve ', leaveRequest.id);
          updateLeaveRequest(params.row);
        }}
      >
        <CheckCircleIcon />
      </IconButton>
      <IconButton
        title="Reject Leave Request"
        disabled={!params.row.approved}
        onClick={() => {
          console.log('Reject ', leaveRequest);
          updateLeaveRequest(params.row);
        }}
      >
        <BlockIcon />
      </IconButton>
    </ButtonGroup>
  );

  const rows = leave;

  const columns = [
    {
      field: 'employee',
      headerName: 'Employee',
      width: 250,
    },
    {
      field: 'type',
      headerName: 'Leave Type',
      width: 200,
    },
    {
      field: 'startDate',
      headerName: 'Leave Start',
      width: 200,
      valueFormatter: (params) => {
        const formattedStartDate = format(params.value.toDate(), 'dd MMMM yyyy');
        return formattedStartDate;
      }
    },
    {
      field: 'endDate',
      headerName: 'Leave End',
      width: 200,
      valueFormatter: (params) => {
        const formattedEndDate = format(params.value.toDate(), 'dd MMMM yyyy');
        return formattedEndDate;
      }
    },
    {
      field: 'approved',
      headerName: 'Approved?',
      width: 200,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: actionsButtonGroup
    }
  ];

  return (
    <>
      <Helmet>
        <title>HRMS | Leave Requests</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <CreateButton />
            <div style={{ height: 800, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                components={{
                  Toolbar: GridToolbar,
                }}
              />
            </div>
            {
              (dialogType === 'create' || dialogType === 'view')
              && (
                <LeaveForm
                  leaveRequest={leaveRequest}
                  setLeaveRequest={setLeaveRequest}
                  dialogType={dialogType}
                  open={open}
                  handleClose={handleClose}
                />
              )
            }
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LeavePage;
