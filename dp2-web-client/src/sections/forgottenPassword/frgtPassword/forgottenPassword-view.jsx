import { toast } from 'react-toastify';
import {useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function ForgottenPasswordView() {
  const router = useRouter();
  const { user } = useAuth();


  
  const navigate=useNavigate();
  
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  },);
  const theme = useTheme();
  const emailRef = useRef(null);

  const handleClick = async (e) => {
    const regEx=/[a-zA-Z0-9+_%+-]+@[a-z0-9]+\.[a-z]{2,8}(.[a-z{2,8}])?/g

    if(regEx.test(emailRef.current.value)){
        console.log('emailRef', emailRef.current.value)
        try {
            const response = await fetch('http://localhost:3000/api/password/olvidoPasswordWeb ', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({email:emailRef.current.value}) // Propiedad abreviada
            });
        
            const responseData  = await response.json();
        
            console.log('SOY LA DATA DE RESPUESTA')
            console.log(responseData.id)
            if (responseData.id!==0) {
              console.log('HURRA')
              sessionStorage.setItem('UsuarioIDRecupracion',responseData.id)
              sessionStorage.setItem('CodigoRecuperacion',responseData.codigo)
              toast.success('Email enviado exitosamente.', {
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
                  navigate('/CodeValidation');
                }
              });

            }
            else{
              toast.error("Error: No existe un usuario asociado a este correo", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
              });

            }
          } catch (error) {
            console.error('Error fetching users:', error);
            throw error; // Lanzar el error para manejarlo en el componente que llama a getUsers
          }
    }
    else{
        console.log('Correo invalido')
      toast.error("Error: El correo no es valido", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <p>Ingresa el correo de la cuenta asociada. Se te enviará un mail para recuperar tu contraseña</p>
        <TextField inputRef={emailRef} name="email" label="Correo" />

      </Stack>
      <br />
      <Box mb={2}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          style={{
            background: 'linear-gradient(135deg, #003B91, #0081CF)',
            color: 'white',
          }}
          onClick={handleClick}
        >
          Recuperar contraseña
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

        <Card sx={{ p: 4, width: '25%', maxWidth: 1200, maxHeight: '95vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4">Recuperar Contraseña</Typography>
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

