import PropTypes from 'prop-types';
import { useState,useEffect} from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { fetchAccountData } from 'src/_mock/accountData';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar'; // Import HelpOutline icon
import { NAV } from './config-layout';
import NavBar from './config-navigation';
// Ruta corregida


// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const [account, setAccount] = useState({
    activo: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: ''
  });
  const upLg = useResponsive('up', 'lg');

  const [openPDF, setOpenPDF] = useState(false); // New state for PDF modal
  const [pdfUrl, setPdfUrl] = useState(''); // New state for PDF URL

  const handleOpenPDF = async() => {
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    console.log(userStringify.token);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;
    console.log("estoy consultando el usuario para el navbar");
    const response = await fetch('http://localhost:3000/api/tiendas/getPdfManual', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      },
    });

    const data = await response.json();
    console.log(data);
    const url = data.urlPdf;
    setPdfUrl(url);
    setOpenPDF(true);
  };

  const handleClosePDF = () => setOpenPDF(false);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const data = await fetchAccountData();
        console.log("viendo data")
        console.log(data)
        if(data.status===403 || data.status===401){
          localStorage.removeItem('user');
          window.location.reload();
        }
        if(data.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el cupón en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        console.log(data.findUser)
        setAccount(data.findUser);
      } catch (error) {
        console.error('Error loading account data:', error);
      }
    };
    loadAccountData();
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,

        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        color:"white"
      }}
    >
      <Avatar src={account.photoURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle1" sx={{fontSize: 16}}>{account.nombre} {account.apellido}</Typography>
        <Typography variant="body2" sx={{ color: 'white',fontSize: 16, }}>
          {account.rol}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <NavBar />
  );

  const renderUpgrade = (
    <Box sx={{ px: 2.5, pb: 3, mt: 10 }} />
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, ml: 4, mr: 2 }}>
        <Logo />
        <IconButton onClick={handleOpenPDF} sx={{ color: 'white' }}>
          <HelpOutlineIcon style={{ width: 24, height: 24 }} />
        </IconButton>
      </Box>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

      {renderUpgrade}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
        background: 'linear-gradient(135deg, #003B91, #0081CF)',
        border: 0,
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
      <Modal
        open={openPDF}
        onClose={handleClosePDF}
        aria-labelledby="modal-modal-title-pdf"
        aria-describedby="modal-modal-description-pdf"
      >
        <Box sx={{ ...modalStyle, width: '80%', height: '80%' }}>
          <IconButton
            aria-label="close"
            onClick={handleClosePDF}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </Box>
      </Modal>
    </Box>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------
