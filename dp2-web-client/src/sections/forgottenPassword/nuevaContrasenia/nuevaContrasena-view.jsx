import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {useRef, useState,useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import fondo from 'src/components/images/fondo-nuevo.jpg';

import { useAuth } from '../../../utils/AuthContext'

// ----------------------------------------------------------------------

export default function NuevaContrasenaView() {
  const router = useRouter();
  const { user } = useAuth();
  const [message,setMessage]=useState('');
  const navigate=useNavigate();
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  },);
  const theme = useTheme();
  const emailRef = useRef(null);
  const nuevaContra2 = useRef(null);

  const handleClick = async (e) => {

    console.log('emailRef', emailRef.current.value)
    
    const nuevaContrasenia=emailRef.current.value
    const idUsuario = sessionStorage.getItem('UsuarioIDRecupracion')
    const codigoValidacion = sessionStorage.getItem('CodigoRecuperacion')

    if(emailRef.current.value!==nuevaContra2.current.value){
      toast.error("Error: Las contraseñas deben ser iguales", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }else{
      try {
        const response = await fetch('http://localhost:3000/api/password/cambiarPasswordWeb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({idUsuario,nuevaContrasenia,codigoValidacion}) // Propiedad abreviada
        });

        const responseData  = await response.json();

        console.log('SOY LA DATA DE RESPUESTA')
        console.log(responseData)
        console.log(emailRef.current.value)
        console.log(nuevaContra2)
        if(responseData.estado!==1 && responseData.estado!==0){

          setMessage(responseData.message)

        }
        else if(responseData.estado===0){
          setMessage(responseData.message)
        }
        else{
          console.log('Todo bien')
          toast.success('Contraseña cambiada exitosamente. Redirigendo al login', {
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
      } catch (error) {
        toast.error("Error inesperado", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        console.error('Error fetching users:', error);
        throw error; // Lanzar el error para manejarlo en el componente que llama a getUsers
      }
    }

  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <p>Ingrese su nueva contraseña</p>
        <TextField inputRef={emailRef} name="email" label="Nueva Contraseña" />
        <p>Vuelva a ingresar su nueva contraseña</p>
        <TextField inputRef={nuevaContra2} name="email2" label="Reingrese Nueva Contraseña" />
        <br />
        {message}
      </Stack>

      <Box mb={2}>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        style={{ background: 'linear-gradient(135deg, #003B91, #0081CF)',
        color: 'white'}}
        onClick={handleClick}
      >
        Cambiar Contraseña
      </LoadingButton>
    </Box>
    </>
  );

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
        <Card sx={{ p: 4, width: '25%', maxWidth: 1200, maxHeight: '95vh'}}>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4">Nueva Contraseña</Typography>
          </div>
          <div>
            <br />
          </div>
          {renderForm}
        </Card>
      </Box>
    </Box>
  );
}

