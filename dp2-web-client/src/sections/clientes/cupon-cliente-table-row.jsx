import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { makeStyles } from '@mui/styles';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Chip, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../../components/iconify';
import { useAuth } from '../../utils/AuthContext';


// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    padding: "40px",
    backgroundColor: 'white', // Fondo blanco
    boxShadow: 24,
    outline: 'none',
  },
  activo: {
    color: '#008000', // Verde oscuro para activo
    backgroundColor: '#C8E6C9', // Fondo verde claro para activo
    padding: '2px 6px',
    borderRadius: '4px',
  },
  inactivo: {
    color: '#FF0000', // Rojo para inactivo
    backgroundColor: '#FFCDD2', // Fondo rojo claro para inactivo
    padding: '2px 6px',
    borderRadius: '4px',
  },
  usado: {
    color: 'red',
  },
  noUsado: {
    color: 'green',
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function   CuponxClienteTableRow({
                                               id,
                                               codigo,usado,
                                                  categoria,tienda,fechaCompra,fechaExpiracion,selected,handleClick
                                             }) {
  const navigate = useNavigate();
  const { logoutUser,user,getPermissions } = useAuth(); // Asegúrate de que tu hook useAuth proporcione la función logout
  const [open, setOpen] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();
  const [formDatos, setFormDatos] = useState({
    tipo: "cupon",
    idReferencia: id
  });
  const [openQR, setOpenQR] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const formatDateTime = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('es-ES', options);
  };
  const formatearFecha = (fechaISO) => {
    const meses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fechaX = new Date(fechaISO);
    const diaX = String(fechaX.getDate()).padStart(2, '0');
    const mesX = meses[fechaX.getMonth()]; // Los meses son 0-11
    const añoX = fechaX.getFullYear();
    const horaX = String(fechaX.getHours()).padStart(2, '0');
    const minutoX = String(fechaX.getMinutes()).padStart(2, '0');
    return `${diaX} ${mesX} ${añoX} ${horaX}:${minutoX}  `;
  };
  const handleButtonCanjear = () => {
    // Lógica a ejecutar cuando se haga clic en el botón
    setOpenQR(true);
  };
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrCode.png';
    link.click();
  };

  const handleCloseQR = () => setOpenQR(false);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>


        <TableCell>{codigo} </TableCell>

        <TableCell>{categoria}</TableCell>
        <TableCell>{tienda}</TableCell>

        <TableCell>{formatearFecha(fechaCompra)}</TableCell>
        <TableCell>{formatearFecha(fechaExpiracion)}</TableCell>
        <TableCell>
          {usado ? (
            <Chip label="Usado" sx={{backgroundColor:"#D2ECB0", color:"#6F8355"}} />
          ) : (
            <Chip label="No Usado" sx={{backgroundColor:"#F6D1D1", color:"#FF0000"}} />
          )}
        </TableCell>
        <TableCell>
          {usado ? (
            <Button variant="contained" color="primary" onClick={handleOpenQR} disabled>
              Canjear
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleOpenQR}>
              Canjear
            </Button>
          )}

        </TableCell>
      </TableRow>
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

      {/* Modal para editar usuario */}

    </>
  );
}

CuponxClienteTableRow.propTypes = {
  id: PropTypes.number.isRequired,
  codigo: PropTypes.string.isRequired,
  categoria: PropTypes.string.isRequired,
  tienda: PropTypes.string.isRequired,
  fechaCompra: PropTypes.string.isRequired,
  fechaExpiracion: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  usado: PropTypes.bool.isRequired,
};