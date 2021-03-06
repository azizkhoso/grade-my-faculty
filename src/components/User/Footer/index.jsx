import React from 'react';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';

import { useHistory, Link } from 'react-router-dom';

import facebook from '../../../assets/facebook.svg';
import instagram from '../../../assets/instagram.svg';

export default function Footer() {
  const history = useHistory();
  return (
    <Box id="footer" className={`${history.location.pathname === '/admin' && 'hidden'}`} sx={{ top: 'auto', bottom: 0, zIndex: 0 }}>
      <Box sx={{ bgcolor: 'primary.main', width: '100%' }}>
        <Container maxWidth="xl" className="md:px-20" sx={{ py: '20px', height: '200px' }}>
          <Grid container justifyContent="space-between" className="md:px-20">
            <Grid
              item
              xs={6}
              sm={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <Link to="/">
                <Typography className="font-semibold" color="white">Grade My Faculty</Typography>
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Typography className="font-semibold cursor-pointer" color="white">
                  <span aria-hidden onClick={() => history.push('/faq')}>FAQ</span>
                </Typography>
                <Typography className="font-semibold cursor-pointer" color="white">
                  <span aria-hidden onClick={() => history.push('/contact')}>Contact Us</span>
                </Typography>
                <Typography className="font-semibold cursor-pointer" color="white">
                  <span aria-hidden onClick={() => history.push('/blog')}>Blog</span>
                </Typography>
              </div>
            </Grid>
            <Grid
              item
              xs={6}
              sm={3}
              lg={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <Typography color="white" className="font-semibold">Follow Us</Typography>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="https://www.facebook.com/grademyfaculty/">
                  <Icon>
                    <img src={facebook} alt="facebook" />
                  </Icon>
                </a>
                <a href="https://www.instagram.com/grademyfaculty/">
                  <Icon>
                    <img src={instagram} alt="instagram" />
                  </Icon>
                </a>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container maxWidth="xl" className="relative md:px-40" sx={{ py: 3, bgcolor: 'white' }}>
        <div className="w-full">
          <Typography color="gray" className="flex items-center justify-between text-sm font-semibold md:text-base">
            <span>&copy; 2022 Grade My Faculty. All Rights Reserved</span>
            <a href="https://usmandeveloper.com/">
              UD
            </a>
          </Typography>
        </div>
      </Container>
    </Box>
  );
}
