import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Collapse, Modal, Typography, Button, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SvgColor from 'src/components/svg-color';
import BasicBreadcrumbs from '../../routes/BasicBreadcrumbs'; // Ruta corregida
import { usePathname } from '../../routes/hooks';
import { useAuth } from '../../utils/AuthContext';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------


  function NavItem({ item,handleOpenQR }) {
    const pathname = usePathname();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const active = item.path === pathname;
    const handleClick = () => {
      if (item.title === 'Ver QR') {
        handleOpenQR();
      } else if (item.onClick) {
        item.onClick(); // Llama al onClick específico del ítem, si existe
      } else if (item.subMenu) {
        setOpen(!open);
      } else {
        navigate(item.path);
      }
    };
    return (
      <>
        <ListItemButton onClick={handleClick} sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          fontSize: 16,
          color: "white",
          ...(item.path === usePathname() && {
            color: 'white',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.28),
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}>
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
            {item.icon}
          </Box>
          <Box component="span">{item.title}</Box>
          {item.subMenu && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        {item.subMenu && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
              {item.subMenu.map((subItem) => (
                <NavItem key={subItem.title} item={subItem} handleOpenQR={handleOpenQR} />
              ))}
            </Stack>
          </Collapse>
        )}
      </>
    );
  }

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleOpenQR: PropTypes.func.isRequired
};


  export default function NavBar() {
    const { logoutUser,user,getPermissions } = useAuth(); // Asegúrate de que tu hook useAuth proporcione la función logout
    const [permissions, setPermissions] = useState([]);

    const [openQR, setOpenQR] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [openPDF, setOpenPDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    const handleOpenQR = async () => {
      try {
        const userX = localStorage.getItem('user');
        const userStringify = JSON.parse(userX);
        const { token, refreshToken } = userStringify;

        const response = await fetch(`http://localhost:3000/api/qr/generar`, {
          method: 'POST',
          body: JSON.stringify(formDatos),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Agregar el token de autorización si es necesario
          },
        });

        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
          return;
        }

        const data = await response.json();
        setQrCode(data.qrCode);  // Almacenar el código QR en el estado
        setOpenQR(true);  // Abrir el modal
      } catch (error) {
        console.error('Error fetching crear QR:', error);
        throw error;
      }
    };

    const handleOpenPDF = async () => {
      try {
        const response = await fetch('https://your-s3-bucket.amazonaws.com/your-pdf-file.pdf'); // Cambia esta URL por la de tu archivo en S3
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const url = await response.url;
        setPdfUrl(url);
        setOpenPDF(true);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        throw error;
      }
    };

    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = 'qrCode.png';
      link.click();
    };

    const handleCloseQR = () => setOpenQR(false);
    const handleClosePDF = () => setOpenPDF(false);

    useEffect(() => {
      console.log("userNavBar");
      console.log(user);
      const perms = user.permisos;

      setPermissions(perms.map(perm => perm.permission.nombre));


    }, [user]);

    const handleLogout = () => {
      console.log("cerrar sesion")
      logoutUser();
      // Llama a la función logout proporcionada por useAuth para cerrar sesión
    };

    const icon = (name) => (
      <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
    );
    const [formDatos, setFormDatos] = useState({
      tipo: "tienda",
      idReferencia: user && user.tiendaId ? user.tiendaId.toString() : '0',
    });
    const navConfig = [
      {
        title: 'dashboard',
        path: '/',
        icon: icon('ic_analytics'),
        permission: 'Dashboard',
      },
          {
            title: 'Gestión de Usuarios',
            path: '/user',
            icon: icon('ic_user'),
            permission: 'Gestion de Usuarios',
          },
          {
            title: 'Gestión de Cupones',
            path: '/cupon',
            icon: icon('ic_cupon'),
            permission: 'Gestion de Cupones',
          },
          {
            title: 'Gestión de Eventos',
            path: '/evento',
            icon: icon('ic_evento'),
            permission: 'Gestion de Eventos',
          },
          {
            title: 'Gestión de Clientes',
            path: '/clientes',
            icon: icon('ic_cliente'),
            permission: 'Gestion de Clientes',
          },
          {
            title: 'Gestión de Categorías',
            path: '/categorias',
            icon: icon('ic_categoria'),
            permission: 'Gestion de Categorías',
          },
          {
            title: 'Gestión de Tiendas',
            path: '/tienda',
            icon: icon('ic_tienda'),
            permission: 'Gestion de Tiendas',
          },
          {
            title: 'Ver QR',
            path: '/verqr',
            icon: icon('ic_qr'),
            permission: 'Ver QR',
          },
          {
            title: 'Ver PDF',
            path: '/verpdf',
            icon: icon('ic_pdf'),
            permission: 'Ver PDF',
          },
          // Otras opciones de submenú...

      {
        title: 'Cerrar sesión',
        icon: <ExitToAppIcon />,
        onClick: () => handleLogout(), // Define la función handleLogout para cerrar sesión
      },

    ];
    const filteredNavConfig = navConfig.filter(item =>

      !item.permission || permissions.includes(item.permission)
    );
    return (
      <>
      <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
        {filteredNavConfig.map((item) => (
          <NavItem key={item.title} item={item}  handleOpenQR={handleOpenQR} handleOpenPDF={handleOpenPDF}/>
        ))}
      </Stack>
    <Modal
      open={openQR}
      onClose={handleCloseQR}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...modalStyle, width: 400 }}>
        <IconButton
          aria-label="close"
          onClick={handleCloseQR}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Código QR Generado
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <img src={qrCode} alt="Código QR" style={{ width: '100%' }} />
          <Button
            variant="contained"
            color="info"
            sx={{ mt: 2, backgroundColor: "#003B91", color: "#FFFFFF", width: '100%' }}
            onClick={handleDownload}
          >
            <Iconify icon="icon-park-outline:download" sx={{ fontSize: '24px', marginRight: '8px' }} />
            Descargar
          </Button>
        </Typography>

      </Box>
    </Modal>
      </>
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
