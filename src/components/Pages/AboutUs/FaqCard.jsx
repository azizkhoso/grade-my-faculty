import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import { Typography } from '@mui/material';

export default function FaqCard({ image, title }) {
  return (
    <Card style={{ width: 525, height: 334 }} className="bg-white flex flex-col items-center justify-center gap-3">
      <img src={image} alt={title} />
      <Typography variant="h2" className="font-extrabold">{title}</Typography>
    </Card>
  );
}

FaqCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
