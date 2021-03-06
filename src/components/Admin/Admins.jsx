/* eslint-disable no-underscore-dangle */
import React from 'react';

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
  Grid,
  CircularProgress,
} from '@mui/material';

import {
  ChevronLeft,
  ChevronRight,
  DeleteForever,
  Visibility,
} from '@mui/icons-material';

import { useQuery, useMutation } from '@apollo/client';

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTab } from '../../redux/adminActions';
import { addToast } from '../../redux/toastsActions';

import Search from '../../assets/Search.svg';

import {
  ADMINS,
  UPDATE_ADMIN,
  DELETE_ADMIN,
  ABOUT_US,
} from '../../graphqlQueries';
import AboutUs from './AboutUs';

export default function Admins() {
  const dispatch = useDispatch();
  const [offset, setOffset] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');
  const currentAdmin = useSelector((state) => state.account.admin);
  const { loading, data } = useQuery(
    ADMINS,
    {
      fetchPolicy: 'cache-and-network',
      variables: { offset, limit: 10, name: searchValue },
    },
  );
  const aboutUsQuery = useQuery(ABOUT_US);
  const [updateAdmin] = useMutation(UPDATE_ADMIN, { refetchQueries: [{ query: ADMINS }] });
  const [deleteAdmin] = useMutation(DELETE_ADMIN, { refetchQueries: [{ query: ADMINS }] });
  function handleStatusChange(value, admin) {
    if (Number(currentAdmin._id) === Number(admin._id)) {
      dispatch(addToast({ message: 'Sorry, you can not change your status', severity: 'error' }));
    } else {
      const variables = {
        id: Number(admin._id),
        status: value,
      };
      updateAdmin({ variables })
        .then(() => dispatch(addToast({ message: 'Admin status updated successfully', severity: 'success' })))
        .catch((r) => dispatch(addToast({ message: r.message, severity: 'error' })));
    }
  }
  function handleDelete(_id) {
    deleteAdmin({ variables: { id: Number(_id) } })
      .then(() => dispatch(addToast({ message: 'Admin deleted successfully', severity: 'success' })))
      .catch((r) => dispatch(addToast({ message: r.message, severity: 'error' })));
  }
  function nextPage() {
    if (data && offset < data.allAdmins) {
      setOffset((off) => off + 10);
    }
  }
  function prevPage() {
    if (data && offset > 0) {
      setOffset((off) => off - 10);
    }
  }
  return (
    <Grid container rowSpacing={8} columnSpacing={8}>
      <Grid item xs={12} md={6}>
        <div className="flex flex-col w-full gap-9">
          <div className="flex flex-col w-full gap-2 md:gap-6 md:flex-row md:items-center" style={{ maxHeight: '38px' }}>
            <Typography className="ml-16 text-3xl text-gray-400">Admins</Typography>
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
            <Button variant="contained" className="w-full h-full px-1 md:w-48 shadow-primaryGlow" onClick={() => dispatch(setCurrentTab({ name: 'addAdmin', data: null }))}>Add Admins</Button>
          </div>
          <TableContainer className="w-full max-h-full bg-white mt-14 md:mt-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold text-gray-400">ID</TableCell>
                  <TableCell className="text-lg font-semibold text-gray-400">Name</TableCell>
                  <TableCell className="font-semibold text-gray-400">Email</TableCell>
                  <TableCell className="font-semibold text-gray-400">Status</TableCell>
                  <TableCell className="font-semibold text-center text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHead>
              {
                !loading && data && (
                  <TableBody>
                    {
                      data?.admins.map((admin) => (
                        <TableRow key={admin._id} className="hover:shadow-md">
                          <TableCell className="text-gray-400">{admin._id}</TableCell>
                          <TableCell className="text-lg font-semibold text-black">{admin.name}</TableCell>
                          <TableCell className="text-gray-400">{admin.email}</TableCell>
                          <TableCell className="text-gray-600">
                            <select value={admin.status} onChange={(event) => handleStatusChange(event.target.value, admin)} className="w-24 min-w-full p-2 bg-gray-200">
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </TableCell>
                          <TableCell className="text-center">
                            <IconButton onClick={() => dispatch(setCurrentTab({ name: 'editAdmin', data: admin }))}>
                              <Visibility />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(admin._id)}>
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
                loading && <div className="absolute left-0 right-0 flex items-center justify-center lg:-left-1/2"><CircularProgress /></div>
              }
            </Table>
          </TableContainer>
          <div className="flex justify-end w-full gap-12 mt-16">
            <IconButton className={`rounded-none shadow-lg ${(offset - 10) < 0 ? 'bg-gray-400' : 'bg-primary'}`} onClick={() => prevPage()}>
              <ChevronLeft className="w-10 h-10" htmlColor="white" />
            </IconButton>
            <IconButton className={`rounded-none shadow-lg ${(offset + 10) >= data?.allAdmins ? 'bg-gray-400' : 'bg-primary'}`} onClick={() => nextPage()}>
              <ChevronRight className="w-10 h-10" htmlColor="white" />
            </IconButton>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} md={6} className="flex flex-col gap-9">
        <Typography className="text-3xl text-gray-400" style={{ minHeight: '38px' }}>About Us</Typography>
        {
          aboutUsQuery.loading && <div className="relative inset-0 flex items-center justify-center"><CircularProgress /></div>
        }
        {
          !aboutUsQuery.loading && (
            <AboutUs
              ourStory={aboutUsQuery.data?.aboutUs.ourStory}
              whoWeAre={aboutUsQuery.data?.aboutUs.whoWeAre}
              ourMission={aboutUsQuery.data?.aboutUs.ourMission}
            />
          )
        }
      </Grid>
    </Grid>
  );
}
