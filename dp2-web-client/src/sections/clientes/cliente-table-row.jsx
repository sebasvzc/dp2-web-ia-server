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
// import InputAdornment from '@mui/material/InputAdornment';

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

export default function ClienteTableRow({
                                          nombre,
                                          id,
                                          genero,
                                          apellidoPaterno,
                                          apellidoMaterno,
                                          emailX,
                                          selected,
                                          puntos,
                                          telefono,
                                          handleClick,
                                          activo,
                                          apellido,
                                          onEditUer
                                        }) {
  const [open, setOpen] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();
  const [editedUser, setEditedUser] = useState({
    id,
    nombre,
    apellido,
    apellidoPaterno,
    apellidoMaterno,
    email: emailX,
    activo,
    password: ""
  });
  const handleGuardarCambios = async() => {
    console.log("Usuario a modificar: ",editedUser)
    try {
      const response = await fetch('http://localhost:3000/api/user/modificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ editedUser }),
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
      onEditUer();
      // handleCloseModal(); // Cierra el modal después de enviar
    } catch (e) {
      console.error('Error al habilitar usuarios:', e);
    }
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
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleOpenModalEdit = () => {

    navigate(`/clientes/detalle/${id}`)
  };

  const handleCloseModalEdit = () => {
    setOpenEdit(false);
  };

  const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
  const [mostrarTxtApp, setMostrarTxtApp] = useState("");
  const [mostrarTxtCorreo, setMostrarTxtCorreo] = useState("");
  const [mostrarTxtCont, setMostrarTxtCont] = useState("");

  const [backgroundBtnMod, setBackgroundBtnMod] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

  console.log(editedUser.nombre)
  console.log(editedUser.apellido)
  console.log(editedUser.email)
  console.log(editedUser.password)

  useEffect(() => {
    const tieneAlMenosUnNumero = /\d/.test(editedUser.password);
    const tieneAlMenosUnaMayuscula = /[A-Z]/.test(editedUser.password);
  
    let tamanho = false;
    if (editedUser.password.length >= 8) {
      tamanho=true;
    }
    if(tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula && tamanho 
      && editedUser.email.length!==0 && validarEmail(editedUser.email)
      && editedUser.nombre.length!==0 && validarNombre(editedUser.nombre)
      && editedUser.apellido.length!==0 && validarNombre(editedUser.apellido)){
      setBackgroundBtnMod("#003B91");
      setBotonDeshabilitado(false);
    }else{
      setBackgroundBtnMod("#CCCCCC");
      setBotonDeshabilitado(true);
    }
    if ((editedUser.nombre.length!==0 && validarNombre(editedUser.nombre)) || editedUser.nombre.length===0) {
      setMostrarTxtNomb("");
    } else {
      setMostrarTxtNomb("Nombre inválido");
    }
    if ((editedUser.email.length!==0 && validarEmail(editedUser.email)) || editedUser.email.length===0) {
      setMostrarTxtCorreo("");
    } else {
      setMostrarTxtCorreo("Correo inválido");
    }
    if ((tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula && tamanho && editedUser.password.trim().length !== 0) || editedUser.password.trim().length===0 ) {
      setMostrarTxtCont("");
    } else {
      setMostrarTxtCont("Debe tener 8 digitos o más (mínimo 1 mayúscula y 1 número");
    }
  }, [editedUser.nombre,editedUser.email,editedUser.apellidoPaterno,editedUser.apellidoMaterno,editedUser.password,editedUser.apellido]);
  

  return (
    <>
      <Card variant="outlined" sx={{ marginBottom: 1.5, border: -2 , background: 'linear-gradient(to bottom, rgba(135, 206, 250, 0.05), rgba(0, 191, 255, 0.01))', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'}}>
        <CardContent>
          <Checkbox disableRipple checked={selected} onChange={handleClick} 
          style={{ backgroundColor: "F9FAFB", color: 'black'}}/>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/assets/images/avatars/icon-grey-free-vector.jpg" alt="Avatar"
                 style={{ width: 100, height: 100, borderRadius: '50%' }} />
            <div style={{ marginLeft: 16 }}> {/* Espacio entre la imagen y el texto */}
              <Typography variant="h6" component="div">
                {nombre} {apellidoPaterno}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Puntos: {puntos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Telefono: {telefono}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {emailX}
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
        <MenuItem onClick={handleCloseMenu}>
           <IconButton onClick={handleOpenModalEdit}>
          <Iconify icon="mdi:eye" sx={{ mr: 1 }} />
          <span style={{ fontSize: 'smaller' }}>Ver</span>
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
              value={editedUser.nombre}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <input className="inputEspecialAC" type="text" value={mostrarTxtNomb} onChange={handleInputChange} 
            style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none',height: "12px"}}
            disabled/>
           
          <TextField
            name="apellido"
            label="Apellido"
            value={editedUser.apellido}
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
            value={editedUser.rol}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
           <input className="inputEspecialAC" type="text"
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none',height: "12px"}}
          disabled/>
         
          <TextField
            name="email"
            label="Email"
            value={editedUser.email}
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

ClienteTableRow.propTypes = {
  nombre: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  genero: PropTypes.string.isRequired,
  apellidoPaterno: PropTypes.string.isRequired,
  apellidoMaterno: PropTypes.string.isRequired,
  puntos: PropTypes.string.isRequired,
  telefono: PropTypes.string.isRequired,
  emailX: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  activo: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  onEditUer: PropTypes.func.isRequired,
};
