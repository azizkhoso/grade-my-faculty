import React from 'react';

import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import TopBar from './components/TopBar';

import themeOptions from './themeOptions';

const theme = createTheme(themeOptions);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <TopBar />
      <Button variant="contained">Initial Setup</Button>
    </ThemeProvider>
  );
}
