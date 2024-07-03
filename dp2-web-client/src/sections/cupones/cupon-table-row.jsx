import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function CuponTableRow({
                                        id,
                                        selected,
                                        codigo,
                                        fidLocatario,
                                        fidTipoCupon,
                                        sumilla,
                                        handleClick,
                                        descripcionCompleta,
                                        fechaExpiracion,
                                        terminosCondiciones,
                                        esLimitado,
                                        costoPuntos,
                                        cantidadInicial,
                                        cantidadDisponible,
                                        ordenPriorizacion,
                                        rutaFoto,
                                        activo,
                                        createdAt,
                                        updatedAt,
                                        onEditCupon
                                     }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();
  
  const [editedCupon, setEditedCupon] = useState({
    id,
    codigo,
    fidLocatario,
    fidTipoCupon,
    sumilla,
    descripcionCompleta,
    fechaExpiracion,
    terminosCondiciones,
    esLimitado,
    costoPuntos,
    cantidadInicial,
    cantidadDisponible,
    ordenPriorizacion,
    rutaFoto,
    activo,
    createdAt,
    updatedAt
  });

 
  const handleGuardarCambios = async() => {
    /*
    console.log("Usuario a modificar: ",editedCupon)
    try {
      const response = await fetch('http://localhost:3000/api/Cupon/modificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ editedCupon }),
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
    */
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
    setEditedCupon({ ...editedCupon, [name]: value });
  };

  const handleOpenModalEdit = () => {
    console.log(id)
    navigate(`/cupon/detalle/${id}`);
  };

  const handleCloseModalEdit = () => {
    console.log(id)
    navigate(`/cupon/editar/${id}`);
  };

  const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
  const [mostrarTxtApp, setMostrarTxtApp] = useState("");
  const [mostrarTxtCorreo, setMostrarTxtCorreo] = useState("");
  const [mostrarTxtCont, setMostrarTxtCont] = useState("");

  const [backgroundBtnMod, setBackgroundBtnMod] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

  /*
  useEffect(() => {
    const tieneAlMenosUnNumero = /\d/.test(editedCupon.password);
    const tieneAlMenosUnaMayuscula = /[A-Z]/.test(editedCupon.password);
  
    let tamanho = false;
    if (editedCupon.password.length >= 8) {
      tamanho=true;
    }
    if(tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula && tamanho 
      && editedCupon.email.length!==0 && validarEmail(editedCupon.email)
      && editedCupon.nombre.length!==0 && validarNombre(editedCupon.nombre)
      && editedCupon.apellido.length!==0 && validarNombre(editedCupon.apellido)){
      setBackgroundBtnMod("#003B91");
      setBotonDeshabilitado(false);
    }else{
      setBackgroundBtnMod("#CCCCCC");
      setBotonDeshabilitado(true);
    }
    if ((editedCupon.nombre.length!==0 && validarNombre(editedCupon.nombre)) || editedCupon.nombre.length===0) {
      setMostrarTxtNomb("");
    } else {
      setMostrarTxtNomb("Nombre inválido");
    }
    if ((editedCupon.apellido.length!==0 && validarNombre(editedCupon.apellido)) || editedCupon.apellido.length===0 ) {
      setMostrarTxtApp("");
    } else {
      setMostrarTxtApp("Apellido Paterno inválido");
    }
    if ((editedCupon.email.length!==0 && validarEmail(editedCupon.email)) || editedCupon.email.length===0) {
      setMostrarTxtCorreo("");
    } else {
      setMostrarTxtCorreo("Correo inválido");
    }
    if ((tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula && tamanho && editedCupon.password.trim().length !== 0) || editedCupon.password.trim().length===0 ) {
      setMostrarTxtCont("");
    } else {
      setMostrarTxtCont("Debe tener 8 digitos o más (mínimo 1 mayúscula y 1 número");
    }
  }, [editedCupon.nombre,editedCupon.email,editedCupon.apellido,editedCupon.password]);
  */

  const fecha = new Date(fechaExpiracion);
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
  const año = fecha.getFullYear();

  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  const mesFormateado = mes < 10 ? `0${mes}` : mes;
  const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;

  const formatearFecha = (fechaISO) => {
    const meses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fechaX = new Date(fechaISO);
    const diaX = String(fecha.getDate()).padStart(2, '0');
    const mesX = meses[fecha.getMonth()]; // Los meses son 0-11
    const añoX = fecha.getFullYear();
    return `${diaX} ${mesX} ${añoX}`;
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
            <div style={{ marginLeft: 16 }}> {/* Espacio entre la imagen y el texto */}
              <Typography variant="h6" component="div">
                {codigo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sumilla}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha de Vencimiento: {formatearFecha(fechaFormateada)}
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
      
    </>
  );
}

CuponTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  codigo: PropTypes.string.isRequired,
  fidLocatario: PropTypes.string.isRequired,
  fidTipoCupon: PropTypes.string.isRequired,
  sumilla: PropTypes.string.isRequired,
  handleClick: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  descripcionCompleta: PropTypes.string.isRequired,
  fechaExpiracion: PropTypes.string.isRequired,
  terminosCondiciones: PropTypes.string.isRequired,
  esLimitado: PropTypes.string.isRequired,
  costoPuntos: PropTypes.string.isRequired,
  cantidadInicial: PropTypes.string.isRequired,
  cantidadDisponible: PropTypes.string.isRequired,
  ordenPriorizacion: PropTypes.string.isRequired,
  rutaFoto: PropTypes.string.isRequired,
  activo: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  onEditCupon: PropTypes.func.isRequired,
};