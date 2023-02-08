import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';

import logologin from '../assets/images/logos/logo_birobid.png';

// ----------------------------------------------------------------------

Logologin.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logologin({ disabledLink = false, sx }) {
  
  const logo = (
    <Box sx={{ width: 250, height: 80, ...sx }}>
      <img src={logologin} alt="logo"/>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
