import React from 'react';

import {
  Card,
  Grid,
  TextField,
  Button,
  Typography,
} from '@mui/material';

export default function AddAdmin() {
  return (
    <div className="flex flex-col w-full">
      <Grid container rowSpacing={5} columnSpacing={15}>
        <Grid item xs={12}>
          <Typography className="text-4xl font-medium text-gray-500 pb-9">Add Admin</Typography>
          <Card className="flex flex-col w-full gap-12 p-14" elevation={6}>
            <TextField
              variant="standard"
              label="Name"
              className="w-full"
            />
            <TextField
              variant="standard"
              label="Email"
              className="w-full"
            />
            <TextField
              variant="standard"
              type="password"
              label="Password"
              className="w-full"
            />
            <TextField
              variant="standard"
              type="password"
              label="Confirm Password"
              className="w-full"
            />
            <Button variant="contained" style={{ maxHeight: '38px' }} className="self-start w-3/12 py-3 px-9 shadow-primaryGlow">Add</Button>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}