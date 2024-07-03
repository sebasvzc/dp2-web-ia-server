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

export default function CategoriaTableRow({
                                       selected,
                                        id,
                                       descripcion,
                                       handleClick,
                                      activo,
                                       nombre,
                                       onEditCategoria,
                                       onCategoriaUpdated
                                     }) {
  const [open, setOpen] = useState(null);
  const classes = useStyles();
  
  const [editedCategoria, setEditedCategoria] = useState({
    id,
    nombre,
    descripcion,
    activo,
  });
  const [nombreOriginal, setNombreOriginal] = useState(nombre);
  const [descripcionOriginal, setDescripcionOriginal] = useState(descripcion);

  useEffect(()=>{
    if((editedCategoria.nombre.length!==0 && editedCategoria.descripcion.length!==0) &&
        editedCategoria.nombre !== nombreOriginal || editedCategoria.descripcion !== descripcionOriginal){
      setBackgroundBtnMod("#003B91");
      setBotonDeshabilitado(false);
    }else{
      setBackgroundBtnMod("#CCCCCC");
      setBotonDeshabilitado(true);
    }
  }, [editedCategoria.nombre, editedCategoria.descripcion, nombreOriginal, descripcionOriginal])

  const handleGuardarCambios = async () => {
    console.log("Categoría a modificar: ", editedCategoria);
    try {
      const response = await fetch('http://localhost:3000/api/categoriaTienda/editarCategoriaTiendaWeb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nombre: editedCategoria.nombre,
          descripcion: editedCategoria.descripcion,
          idCategoria: editedCategoria.id
        }),
      });
      const data = await response.json();
      console.log(data); // Maneja la respuesta de la API según sea necesario
      if (data.resultado === 1) {
        toast.success('Categoría modificada exitosamente', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        onEditCategoria(); // Actualiza la lista de categorías o realiza acciones adicionales
      } else {
        toast.error(`Error al modificar categoría: ${data.mensaje}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
      }
      onCategoriaUpdated();
      handleCloseModalEdit(); // Cierra el modal después de enviar
    } catch (e) {
      console.error('Error al modificar la categoría:', e);
      toast.error('Error al conectar con el servidor', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
  };
  
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const [openEdit, setOpenEdit] = useState(false); // Estado para controlar la apertura y cierre del modal
  const handleCloseMenu = () => {
    setOpen(null);
  };
  const [openView, setOpenView] = useState(false); // Estado para controlar la apertura y cierre del modal
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCategoria({ ...editedCategoria, [name]: value });
  };

  const handleOpenModalEdit = () => {
    console.log("open edit es true")
    setOpenEdit(true);
  };
  

  const handleCloseModalEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenModalView = () => {
    console.log("open edit es true")
    setOpenView(true);
  };

  const handleCloseModalView = () => {
    setOpenView(false);
  };

  const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
  const [mostrarTxtApp, setMostrarTxtApp] = useState("");
  const [mostrarTxtCorreo, setMostrarTxtCorreo] = useState("");

  const [backgroundBtnMod, setBackgroundBtnMod] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);


 return (
   <>
     <Card variant="outlined" sx={{ marginBottom: 1.5, border: -2 , background: 'linear-gradient(to bottom, rgba(135, 206, 250, 0.05), rgba(0, 191, 255, 0.01))', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'}}>
       <CardContent>
         <Checkbox disableRipple checked={selected} onChange={handleClick}
         style={{ backgroundColor: "F9FAFB", color: 'black'}}/>
         <div style={{ display: 'flex', alignItems: 'center' }}>
           
           <div style={{ marginLeft: 16 }}> {/* Espacio entre la imagen y el texto */}
              <Typography variant="h6" component="div" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitLineClamp: 1 }}>
                {descripcion}
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
           <IconButton onClick={handleOpenModalView}>
          <Iconify icon="mdi:eye" sx={{ mr: 1 }} />
          <span style={{ fontSize: 'smaller' }}>Ver</span>
           </IconButton>
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
           <IconButton onClick={handleOpenModalEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 1 }} />
          <span style={{ fontSize: 'smaller' }}>Editar</span>
           </IconButton>
        </MenuItem>
      </Popover>
      {/* Modal para visualizar usuario */}
      <Modal open={openView} onClose={handleCloseModalView} aria-labelledby="modal-title">
        <div className={classes.modalContainer}>
        <Typography variant="h6" style={{ marginBottom: "20px" }}>Visualizar Categoría</Typography>
          <Stack direction="column" spacing={1}>
            <TextField
              name="nombre"
              label="Nombre"
              value={editedCategoria.nombre}
              fullWidth
              margin="normal"
              disabled
            />

          <TextField
            name="descripcion"
            label="Descripcion"
            sx={{marginTop:10}}
            value={editedCategoria.descripcion}
            fullWidth
            margin="normal"
            multiline rows={5}
            disabled
          />
          
          </Stack>
         <div style={{ display: 'flex', justifyContent: 'right', marginTop: 20 }}>
          <Button color="error" variant="contained" style={{backgroundColor: '#DC3545'}} onClick={handleCloseModalView}>
            Salir
          </Button>
        </div>
        </div>
      </Modal>
      {/* Modal para editar usuario */}
      <Modal open={openEdit} onClose={handleCloseModalEdit} aria-labelledby="modal-title" >
        <div className={classes.modalContainer}>
        <Typography variant="h6" style={{ marginBottom: "20px" }}>Modificar Categoría</Typography>
          <Stack direction="column" spacing={1}>
            <TextField
              name="nombre"
              label="Nombre"
              value={editedCategoria.nombre}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

          <TextField
            name="descripcion"
            label="Descripcion"
            value={editedCategoria.descripcion}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline rows={5}
          />
          
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

CategoriaTableRow.propTypes = {
  nombre: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  activo: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  onEditCategoria: PropTypes.func.isRequired,
  onCategoriaUpdated: PropTypes.func.isRequired,
};