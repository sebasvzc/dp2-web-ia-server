import {  toast } from 'react-toastify';
import { useState,useEffect} from 'react';
import {  useNavigate, useLocation} from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import fondo from 'src/components/images/fondo.avif';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
  const [mostrarTxtApp, setMostrarTxtApp] = useState("");
  const [mostrarTxtCorreo, setMostrarTxtCorreo] = useState("");
  const [mostrarTxtCont, setMostrarTxtCont] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarTxtCont2, setMostrarTxtCont2] = useState("");
  const [showPassword2, setShowPassword2] = useState(false);
  const [password2, setPassword2] = useState("");

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    rol:'user',
    tokenReg:token
  });
  
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChange2 = (event) => {
    setPassword2(event.target.value); // Actualiza el estado de password2 con el valor del TextField
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [backgroundBtnReg, setBackgroundBtnReg] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }

  function validarNombre(nombre) {
    const regexNombre = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
    return regexNombre.test(nombre);
  }

  useEffect(() => {
    const tieneAlMenosUnNumero = /\d/.test(formData.password);
    const tieneAlMenosUnaMayuscula = /[A-Z]/.test(formData.password);

    let tamanho = false;
    if (formData.password.length >= 8) {
      tamanho=true;
    }
    if(tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula && tamanho
      && formData.nombre.length!==0 && validarNombre(formData.nombre)
      && formData.apellido.length!==0 && validarNombre(formData.apellido)
      && password2.length!==0 && password2 === formData.password){
      setBackgroundBtnReg("#003B91");
      setBotonDeshabilitado(false);
    }else{
      setBackgroundBtnReg("#CCCCCC");
      setBotonDeshabilitado(true);
    }
    if ((formData.nombre.length!==0 && validarNombre(formData.nombre)) || formData.nombre.length===0) {
      setMostrarTxtNomb("");
    } else {
      setMostrarTxtNomb("Nombre inválido");
    }
    if ((formData.apellido.length!==0 && validarNombre(formData.apellido)) || formData.apellido.length===0 ) {
      setMostrarTxtApp("");
    } else {
      setMostrarTxtApp("Apellido Paterno inválido");
    }
    if ((tieneAlMenosUnNumero && tieneAlMenosUnaMayuscula && tamanho && formData.password.trim().length !== 0) || formData.password.trim().length===0 ) {
      setMostrarTxtCont("");
    } else {
      setMostrarTxtCont("Debe tener 8 digitos o más (mínimo 1 mayúscula y 1 número");
    }
    if (password2.trim().length===0 || password2 === formData.password) {
      setMostrarTxtCont2("");
    } else {
      setMostrarTxtCont2("Las contraseñas no coinciden");
    }
  }, [password2,formData.password,formData.nombre,formData.apellido]);


  useEffect(() => {
      console.log('Token recibido:', token);
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // const userStringify = JSON.parse(formData);
    console.log(formData);
    // Aquí puedes manejar la lógica de envío del formulario, como enviar los datos al backend
    const fetchData = async () => {
      try {
         const response = await fetch('http://localhost:3000/api/user/signup', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
           body:JSON.stringify(formData)
         });
        console.log(response);

        if(response.status===403 || response.status===401){
          console.log("Cualquiera de 403 o 401")
                toast.error("Error inesperado. Redirigiendo al inicio", {
                    position: "top-right",

                  autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  onClose: () => {
                    // Aquí agregamos la navegación a la página de inicio de sesión
                    navigate('/login');
                  }
                });
        }
        if (!response.ok) {
          console.log("No estamos creado usuarios correctos")
                toast.error("Error inesperado. Redirigiendo al inicio", {
                    position: "top-right",
                  autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  onClose: () => {
                    // Aquí agregamos la navegación a la página de inicio de sesión
                    navigate('/login');
                  }
                });
        }else{
          console.log("Estamos creado usuarios correctos")
          toast.success('Usuario registrado exitosamente.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => {
              // Aquí agregamos la navegación a la página de inicio de sesión
              navigate('/login');
            }
          });
        }

        const data = response.json();
        console.log(data)
      } catch (err) {
        // agregar tostada - Lian Tume
        console.log(err);
      }
    };

    fetchData();

  };
  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <Stack spacing={0}>
          <TextField
            name="nombre"
            label="Nombres"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtNomb} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
        <Stack spacing={0}>
          <TextField
            name="apellido"
            label="Apellidos"
            value={formData.apellido}
            onChange={handleChange}
            fullWidth
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtApp} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
        <Stack spacing={0}>
          <TextField
            name="email"
            label="Correo"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            InputProps={{
              readOnly: true, // Esto hace que el TextField sea de solo lectura
              style: {
                backgroundColor: '#f5f5f5', // Color de fondo para indicar que está bloqueado
                color: '#777', // Color de texto más claro para indicar que está bloqueado
              },
            }}
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtCorreo} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
        <Stack spacing={0}>
          <TextField
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtCont} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
        <Stack spacing={0}>
          <TextField
            name="password"
            label="Ingres de nuevo la contraseña"
            type={showPassword2 ? 'text' : 'password'}
            value={password2}
            onChange={handleChange2}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                    <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <input className="inputEspecialAC" type="text" value={mostrarTxtCont2} onChange={handleChange} 
          style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'white',outline: 'none'}}
          disabled/>
        </Stack>
      </Stack>


      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        style={{ backgroundColor: backgroundBtnReg, mt: 3 , marginTop: "30px" , color: "white"}}
        disabled={botonDeshabilitado}
      >
        Registrarse
      </LoadingButton>
    </form>
  );

  if (typeof (token) === 'undefined') {
    navigate("/login");
  }

  return (
    <Box
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >

      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.1),
            imgUrl: fondo,
          }),
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 },
          }}
        />
        
          <Card sx={{ p: 4, width: '25%', maxWidth: 1200, maxHeight: '95vh' }}>
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h4">Crear cuenta</Typography>
            </div>
            <div>
              <br />
            </div>
            {renderForm}
          </Card>
      
      </Box>
    </Box>
  );
};

