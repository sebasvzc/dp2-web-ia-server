import { useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import { makeStyles } from '@mui/styles';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import Iconify from 'src/components/iconify';



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
}));

function validarEmail(emailX) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(emailX);
}

function validarNombre(nombre) {
  const regexNombre = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
  return regexNombre.test(nombre);
}

export default function EventoTableRow({
                                       selected,
                                       id,
                                       nombre,
                                       fechaInicio,
                                       fechaFin,
                                       descripcion,
                                       fidLugar,
                                       fidTipoEvento,
                                       fidTienda,
                                       rutaFoto,
                                       puntosOtorgados,
                                       edadPromedio,
                                       generoPromedio,
                                       ordenPriorizacion,
                                       activo,
                                       usuarioCreacion,
                                       usuarioActualizacion,
                                       createdAt,
                                       handleClick,
                                       updatedAt,
                                       onEditEvento
                                     }) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();
  
  const [editedEvento, setEditedEvento] = useState({
    id,
    nombre,
    fechaInicio,
    fechaFin,
    descripcion,
    fidLugar,
    fidTipoEvento,
    fidTienda,
    rutaFoto,
    puntosOtorgados,
    edadPromedio,
    generoPromedio,
    ordenPriorizacion,
    activo,
    usuarioCreacion,
    usuarioActualizacion,
    createdAt,
    updatedAt,
  });
  const handleGuardarCambios = async() => {
    console.log("Usuario a modificar: ",editedEvento)
    /* try {
      const response = await fetch('http://localhost:3000/api/user/modificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ editedEvento }),
      });
      const data = await response.json();
      console.log(data); // Maneja la respuesta de la API según sea necesario
      setOpenEdit(false);
      toast.success('Usuario modificado exitosamente', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
      onEditEvento();
      // handleCloseModal(); // Cierra el modal después de enviar
    } catch (e) {
      console.error('Error al habilitar usuarios:', e);
    } */
  };
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const [openEdit, setOpenEdit] = useState(false); // Estado para controlar la apertura y cierre del modal
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvento({ ...editedEvento, [name]: value });
  };
  const handleOpenModalEdit = () => {
    console.log(id)
    navigate(`/evento/detalle/${id}`);
  };

  const handleCloseModalEdit = () => {
    console.log(id)
    navigate(`/evento/editar/${id}`);
  };


  return (
    <>
      <Card variant="outlined" sx={{ marginBottom: 1.5, border: -2 , background: 'linear-gradient(to bottom, rgba(135, 206, 250, 0.05), rgba(0, 191, 255, 0.01))', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'}}>
        <CardContent>
          <Checkbox disableRipple checked={selected} onChange={handleClick} 
          style={{ backgroundColor: "F9FAFB", color: 'black'}}/>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={rutaFoto} alt="Avatar"
                 style={{ width: 100, height: 100, borderRadius: '50%' }} />
            <div style={{ marginLeft: 16, maxWidth: '65%' }}>
              <Typography variant="h6" component="div" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitLineClamp: 2 }}>
                {descripcion}
              </Typography>
              <Typography variant="body2" color="text.primary">
                Fecha: {fechaInicio} - {fechaFin}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              <span className={activo ? classes.activo : classes.inactivo}>
                  {activo ? 'Activo' : 'Inactivo'}
              </span>
              </Typography>
            </div>
          </div>
          <IconButton onClick={handleOpenMenu} sx={{ position: 'absolute', top: 10, right: 10 }}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </CardContent>
      </Card>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 120 },
        }}
      >
        <MenuItem onClick={handleOpenModalEdit}>
           <IconButton onClick={handleOpenModalEdit}>
          <Iconify icon="mdi:eye" sx={{ mr: 1 }} />
          <span style={{ fontSize: 'smaller' }}>Ver</span>
           </IconButton>
        </MenuItem>
        <MenuItem onClick={handleCloseModalEdit}>
           <IconButton onClick={handleCloseModalEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 1 }} />
          <span style={{ fontSize: 'smaller' }}>Editar</span>
           </IconButton>
        </MenuItem>
      </Popover>
      
    </>
  );
}

EventoTableRow.propTypes = {
  selected : PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  fidLugar: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
  fechaInicio: PropTypes.string.isRequired,
  fechaFin: PropTypes.string.isRequired,
  fidTipoEvento: PropTypes.string.isRequired,
  fidTienda: PropTypes.string.isRequired,
  puntosOtorgados: PropTypes.string.isRequired,
  edadPromedio: PropTypes.string.isRequired,
  generoPromedio: PropTypes.string.isRequired,
  ordenPriorizacion: PropTypes.string.isRequired,
  rutaFoto: PropTypes.string.isRequired,
  activo: PropTypes.string.isRequired,
  usuarioCreacion: PropTypes.string.isRequired,
  usuarioActualizacion: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  handleClick: PropTypes.string.isRequired,
  onEditEvento: PropTypes.func.isRequired,
};