import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import { Box } from '@mui/material';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import Foto from 'src/components/images/logo-plaza.png';




// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  // const theme = useTheme();

  // const PRIMARY_LIGHT = theme.palette.primary.light;

  // const PRIMARY_MAIN = theme.palette.primary.main;

  // const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 100,
        height: 60,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <img
        src={Foto} // Ruta de tu imagen PNG personalizada
        alt="Logo de la empresa"
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
  

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
