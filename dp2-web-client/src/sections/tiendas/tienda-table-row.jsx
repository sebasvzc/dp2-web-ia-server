import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState,useEffect} from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router-dom';



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

export default function TiendaTableRow({
                                       selected,
                                       id,
                                       nombre,
                                       fidCategoriaTienda,
                                       descripcion,
                                       locacion,
                                       horaApertura,
                                       horaCierre,
                                       aforo,
                                       rutaFoto,
                                       activo,
                                       usuarioCreacion,
                                       usuarioActualizacion,
                                       createdAt,
                                       handleClick,
                                       updatedAt,
                                       onEditTienda
                                     }) {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();
  
  const [editedTienda, setEditedTienda] = useState({
    id,
    nombre,
    fidCategoriaTienda,
    descripcion,
    locacion,
    horaApertura,
    horaCierre,
    aforo,
    rutaFoto,
    activo,
    usuarioCreacion,
    usuarioActualizacion,
    createdAt,
    updatedAt
  });
  const handleGuardarCambios = async() => {
    console.log("Usuario a modificar: ",editedTienda)
    /* try {
      const response = await fetch('http://localhost:3000/api/user/modificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ editedTienda }),
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
      onEditTienda();
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
    setEditedTienda({ ...editedTienda, [name]: value });
  };
  const handleOpenModalEdit = () => {
    console.log(id)
    navigate(`/tienda/tienda-visualizar/${id}`);
  };

  const handleCloseModalEdit = () => {
    console.log(id)
    navigate(`/tienda/tienda-editar/${id}`);
  };

  const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
  const [mostrarTxtApp, setMostrarTxtApp] = useState("");
  const [mostrarTxtCorreo, setMostrarTxtCorreo] = useState("");


  const [backgroundBtnMod, setBackgroundBtnMod] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

  /*
  useEffect(() => {
    const tieneAlMenosUnNumero = true;
    const tieneAlMenosUnaMayuscula = true;
  

    if(tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula
      && editedTienda.email.length!==0 && validarEmail(editedTienda.email)
      && editedTienda.nombre.length!==0 && validarNombre(editedTienda.nombre)
      && editedTienda.apellido.length!==0 && validarNombre(editedTienda.apellido)){
      setBackgroundBtnMod("#003B91");
      setBotonDeshabilitado(false);
    }else{
      setBackgroundBtnMod("#CCCCCC");
      setBotonDeshabilitado(true);
    }
    if ((editedTienda.nombre.length!==0 && validarNombre(editedTienda.nombre)) || editedTienda.nombre.length===0) {
      setMostrarTxtNomb("");
    } else {
      setMostrarTxtNomb("Nombre inválido");
    }
    if ((editedTienda.apellido.length!==0 && validarNombre(editedTienda.apellido)) || editedTienda.apellido.length===0 ) {
      setMostrarTxtApp("");
    } else {
      setMostrarTxtApp("Apellido Paterno inválido");
    }
    if ((editedTienda.email.length!==0 && validarEmail(editedTienda.email)) || editedTienda.email.length===0) {
      setMostrarTxtCorreo("");
    } else {
      setMostrarTxtCorreo("Correo inválido");
    }
  }, [editedTienda.nombre,editedTienda.email,editedTienda.apellido,editedTienda.password]);
  */

  return (
    <>
      <Card variant="outlined" sx={{ marginBottom: 1.5, border: -2 , background: 'linear-gradient(to bottom, rgba(135, 206, 250, 0.05), rgba(0, 191, 255, 0.01))', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'}}>
        <CardContent>
          <Checkbox disableRipple checked={selected} onChange={handleClick} 
          style={{ backgroundColor: "F9FAFB", color: 'black'}}/>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={rutaFoto} alt="Avatar"
                 style={{ width: 100, height: 100, borderRadius: '50%' }} />
            <div style={{ marginLeft: 16 }}> {/* Espacio entre la imagen y el texto */}
              <Typography variant="h6" component="div">
                {nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {descripcion}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ubicación: {locacion}
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
      {/* Modal para editar usuario */}
      <Modal open={openEdit} onClose={handleCloseModalEdit} aria-labelledby="modal-title" >
        <div className={classes.modalContainer}>
        <Typography variant="h6" style={{ marginBottom: "20px" }}>Modificar Usuario</Typography>
          <Stack direction="column" spacing={1}>
            <TextField
              name="nombre"
              label="Nombre"
              value={editedTienda.nombre}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <input className="inputEspecialAC" type="text" value={mostrarTxtNomb} onChange={handleInputChange} 
            style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none',height: "12px"}}
            disabled/>
           
          <TextField
            name="locacion"
            label="Locación"
            value={editedTienda.locacion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtApp} onChange={handleInputChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none',height: "12px"}}
          disabled/>
          
          <TextField
            name="rol"
            label="Rol"
            value={editedTienda.rol}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
           <input className="inputEspecialAC" type="text"
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none',height: "12px"}}
          disabled/>
         
          <TextField
            name="descripcion"
            label="Descripción"
            value={editedTienda.descripcion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtCorreo} onChange={handleInputChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none',height: "12px"}}
          disabled/>
         
          </Stack>
         <div style={{ display: 'flex', justifyContent: 'right', marginTop: 20 }}>
          <Button color="error" variant="contained" style={{backgroundColor: '#DC3545'}} onClick={handleCloseModalEdit}>
            Cancelar
          </Button>
          <Button color="success" variant="contained"
            onClick={handleGuardarCambios}
            style={{ backgroundColor: backgroundBtnMod, mt: 3 , color: "white", marginLeft: '10px'}}
            disabled={botonDeshabilitado}>
            Guardar
          </Button>
        </div>
        </div>
      </Modal>
    </>
  );
}

TiendaTableRow.propTypes = {
  selected : PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  fidCategoriaTienda: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
  locacion: PropTypes.string.isRequired,
  horaApertura: PropTypes.string.isRequired,
  horaCierre: PropTypes.string.isRequired,
  aforo: PropTypes.string.isRequired,
  rutaFoto: PropTypes.string.isRequired,
  activo: PropTypes.string.isRequired,
  usuarioCreacion: PropTypes.string.isRequired,
  usuarioActualizacion: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  handleClick: PropTypes.string.isRequired,
  onEditTienda: PropTypes.func.isRequired,
};