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

import { useAuth } from '../../../utils/AuthContext';


// ----------------------------------------------------------------------

export default function CodeValidationView() {
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
    console.log('emailRef', emailRef.current.value)
    
    const codigoSesion=sessionStorage.getItem('CodigoRecuperacion')

    if(codigoSesion===emailRef.current.value){
      console.log('Codigo Valido')
      toast.success('Código validado exitosamente.', {
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
          navigate('/NewPassword');
        }
      });
    }
    else{
      console.log('Codigo Invalido')
      toast.error("Error: El código introducido es inválido", {
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
        <p>Se le ha enviado un código por correo. Por favor ingresarlo</p>
        <TextField inputRef={emailRef} name="email" label="Código" />
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
        Validar Código
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
            <Typography variant="h4">Ingrese el código</Typography>
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
