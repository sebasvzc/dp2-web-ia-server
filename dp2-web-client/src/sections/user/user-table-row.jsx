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
import { FormControl, InputLabel, Select } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';



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

export default function UserTableRow({
                                       selected,
                                       nombre,
                                       rol,
                                       rolNom,
                                      rolId,
                                       tiendaId,
                                       tiendaNom,
                                        id,
                                       emailX,
                                       handleClick,
                                        activo,
                                       apellido,
                                       onEditUer
                                     }) {
  const [open, setOpen] = useState(null);

  const classes = useStyles();
  const [isTiendaRol, setIsTiendaRol] = useState(rolId !== 2);
  const [editedUser, setEditedUser] = useState({
    id,
    nombre,
    apellido,
    rol,
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
        body: JSON.stringify({ editedUser,tiendaSeleccionada:selectedTienda,rolSeleccionado:selectedRol }),
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
  const [selectedRol, setSelectedRol] = useState(rolId);
  const [selectedTienda, setSelectedTienda] = useState(tiendaId);
  const [searchTerm, setSearchTerm] = useState('');
  const [tiendas, setTiendas] = useState([]);
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
  const handleRolChange = (event) => {
    console.log("Cambio de rol");
    console.log(typeof event.target.value);
    if(event.target.value==="2"){
      console.log("Asignando");
      setIsTiendaRol(false)
    }else{
      setIsTiendaRol(true)
    }
    setSelectedRol(event.target.value);
    setSelectedTienda(''); // Reset tienda when role changes
  };

  const handleOpenModalEdit = async () => {
    console.log("open edit es true")
    const results =  await getTiendas();
    console.log("viendo resultados", results.tiendas)
    setTiendas(results.tiendas);
    setOpenEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenEdit(false);
  };
  const getTiendas = async () => {
    try {
      const user = localStorage.getItem('user');
      const userStringify = JSON.parse(user);
      const { token, refreshToken } = userStringify;
      let response="";
      console.log(searchTerm)
      if(searchTerm===""){
        response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=all&page=1&pageSize=10`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          }
        });
      }else{
        response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=${searchTerm}&page=1&pageSize=10`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          }
        });
      }


      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('user');
        window.location.reload();
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cupones:', error);
      throw error;
    }
  };
  const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
  const [mostrarTxtApp, setMostrarTxtApp] = useState("");
  const [mostrarTxtCorreo, setMostrarTxtCorreo] = useState("");
  const handleSearch = async (e) => {
    e.preventDefault();
    const results = await getTiendas();
    console.log("viendo resultados", results.tiendas)
    setTiendas(results.tiendas);
  };
  const changeTermSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value)
  };

  const [backgroundBtnMod, setBackgroundBtnMod] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

  console.log(editedUser.nombre)
  console.log(editedUser.apellido)
  console.log(editedUser.email)
  console.log(editedUser.password)

  useEffect(() => {
    const tieneAlMenosUnNumero = true;
    const tieneAlMenosUnaMayuscula = true;
  

    if(tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula
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
    if ((editedUser.apellido.length!==0 && validarNombre(editedUser.apellido)) || editedUser.apellido.length===0 ) {
      setMostrarTxtApp("");
    } else {
      setMostrarTxtApp("Apellido Paterno inválido");
    }
    if ((editedUser.email.length!==0 && validarEmail(editedUser.email)) || editedUser.email.length===0) {
      setMostrarTxtCorreo("");
    } else {
      setMostrarTxtCorreo("Correo inválido");
    }
  }, [editedUser.nombre,editedUser.email,editedUser.apellido,editedUser.password]);
  

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
                {nombre} {apellido}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rol: {rolNom} {tiendaNom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {emailX}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <span className={activo === 1 ? classes.activo : classes.inactivo}>
                    {activo === 1 ? 'Activo' : 'Inactivo'}
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
          

            <FormControl fullWidth>
              <InputLabel id="search-select-rol-label">Rol</InputLabel>
              <Select
                MenuProps={{ autoFocus: false }}
                labelId="search-select-rol-label"
                id="search-select-rol"
                value={selectedRol}
                label="Elegir Rol"
                onChange={handleRolChange}
              >
                <MenuItem value="1">Administrador</MenuItem>

                <MenuItem value="2">Empleado de Tienda</MenuItem>
                <MenuItem value="3">Empleado de Plaza San Miguel</MenuItem>
              </Select>
            </FormControl>
            {isTiendaRol === false && (
              <FormControl fullWidth>
                <InputLabel id="search-select-tienda-label">Tienda</InputLabel>
                <Select
                  MenuProps={{ autoFocus: false }}
                  labelId="search-select-tienda-label"
                  id="search-select-tienda"
                  value={selectedTienda}
                  label="Elegir Tienda"
                  onChange={(e) => setSelectedTienda(e.target.value)}

                >
                  <ListSubheader>
                    <TextField
                      size="small"
                      autoFocus
                      placeholder="Busca una tienda por nombre..."
                      fullWidth
                      value={searchTerm}
                      onChange={changeTermSearch}
                      onKeyDown={(e) => e.stopPropagation()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon onClick={handleSearch} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </ListSubheader>
                  {tiendas.map((option, i) => (
                    <MenuItem key={i} value={option.id}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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

UserTableRow.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,

  rol: PropTypes.string.isRequired,
  rolId: PropTypes.number.isRequired,
  rolNom: PropTypes.string.isRequired,
  tiendaId: PropTypes.string.isRequired,
  tiendaNom: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  emailX: PropTypes.string.isRequired,
  activo: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  onEditUer: PropTypes.func.isRequired,
};