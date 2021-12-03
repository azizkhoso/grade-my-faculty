/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';

import {
  Button,
  InputAdornment,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  CircularProgress,
} from '@mui/material';

import {
  ChevronLeft,
  ChevronRight,
  DeleteForever,
  Visibility,
} from '@mui/icons-material';

import { useQuery, useMutation } from '@apollo/client';

import { useDispatch } from 'react-redux';
import { addToast } from '../../redux/toastsActions';

import Search from '../../assets/Search.svg';

import {
  ALLOWED_EMAILS, DELETE_EMAIL, UPDATE_ALLOWED_EMAIL,
} from '../../graphqlQueries';

import AddEmailDialog from './AddEmailDialog';
import EditEmailDialog from './EditEmailDialog';

export default function AllowedEmails() {
  const dispatch = useDispatch();
  const [openNewEmailDialog, setOpenNewEmailDialog] = useState(false);
  const [updateEmail, setUpdateEmail] = useState({});
  const [openUpdateEmailDialog, setOpenUpdateEmailDialog] = useState(false);
  function doUpdateEmail(email) {
    setUpdateEmail(() => email);
    setOpenUpdateEmailDialog(true);
  }
  const [searchValue, setSearchValue] = React.useState('');
  const { loading, data } = useQuery(ALLOWED_EMAILS);
  const [update] = useMutation(
    UPDATE_ALLOWED_EMAIL,
    { refetchQueries: [{ query: ALLOWED_EMAILS }] },
  );
  const [deleteEmail] = useMutation(DELETE_EMAIL, { refetchQueries: [{ query: ALLOWED_EMAILS }] });
  function handleUpdate(updatedEmail) {
    update({ variables: updatedEmail })
      .then(() => dispatch(addToast({ message: 'Ad updated successfully', severity: 'success' })))
      .catch((r) => dispatch(addToast({ message: r.message, severity: 'error' })));
  }
  function handleStatusChange(value, email) {
    const variables = {
      ...email,
      id: Number(email._id),
      status: value,
    };
    handleUpdate(variables);
  }
  function handleDelete(_id) {
    deleteEmail({ variables: { id: Number(_id) } })
      .then(() => dispatch(addToast({ message: 'Email domain deleted successfully', severity: 'success' })))
      .catch((r) => dispatch(addToast({ message: r.message, severity: 'error' })));
  }
  return (
    <div className="flex flex-col w-full gap-9">
      <AddEmailDialog open={openNewEmailDialog} handleClose={() => setOpenNewEmailDialog(false)} />
      {
        openUpdateEmailDialog
        && (
          <EditEmailDialog
            open={openUpdateEmailDialog}
            handleClose={() => setOpenUpdateEmailDialog(false)}
            handleUpdate={(updatedEmail) => handleUpdate(updatedEmail)}
            email={{ ...updateEmail, _id: Number(updateEmail._id) }}
          />
        )
      }
      <div className="flex flex-col w-full gap-2 md:gap-9 md:flex-row md:items-center" style={{ maxHeight: '38px' }}>
        <Typography className="text-3xl text-gray-400 md:ml-16">Allowed Emails</Typography>
        <div className="flex-grow" />
        <TextField
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={Search} alt="search icon" className="h-9" />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" className="h-full px-9 shadow-primaryGlow" onClick={() => setOpenNewEmailDialog(true)}>Add New Email</Button>
      </div>
      <TableContainer className="w-full max-h-full bg-white mt-14 md:mt-0">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold text-gray-400">ID</TableCell>
              <TableCell className="text-lg font-semibold text-gray-400">Email domain</TableCell>
              <TableCell className="font-semibold text-gray-400">Status</TableCell>
              <TableCell className="font-semibold text-center text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHead>
          {
            !loading && data && (
              <TableBody>
                {
                  data?.allowedEmails.filter(
                    (email) => email.emailDomain.toLowerCase().includes(searchValue),
                  ).map((email) => (
                    <TableRow key={email._id} className="hover:shadow-md">
                      <TableCell className="text-gray-400">{email._id}</TableCell>
                      <TableCell className="text-lg font-semibold text-black">{email.emailDomain}</TableCell>
                      <TableCell className="text-gray-600">
                        <select value={email.status} className="w-24 min-w-full p-2 bg-gray-200" onChange={(event) => handleStatusChange(event.target.value, email)}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-center">
                        <IconButton onClick={() => doUpdateEmail(email)}>
                          <Visibility />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(email._id)}>
                          <DeleteForever />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            )
          }
          {
            loading && <div className="absolute inset-x-0 flex items-center justify-center"><CircularProgress /></div>
          }
        </Table>
      </TableContainer>
      <div className="flex justify-end w-full gap-12 mt-16">
        <IconButton className="bg-gray-400 rounded-none shadow-lg">
          <ChevronLeft className="w-10 h-10" htmlColor="white" />
        </IconButton>
        <IconButton className="rounded-none shadow-lg bg-primary">
          <ChevronRight className="w-10 h-10" htmlColor="white" />
        </IconButton>
      </div>
    </div>
  );
}
