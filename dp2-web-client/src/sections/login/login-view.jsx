import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {useRef, useState,useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import fondo from 'src/components/images/fondo-nuevo.jpg';

import LoginUsuario from '../../_mock/account';
import { useAuth } from '../../utils/AuthContext'


// ----------------------------------------------------------------------

export default function LoginView() {
  const router = useRouter();
  const { user, loginUser } = useAuth();
  const navigate=useNavigate();

  useEffect(() => {
    if (user) {
      if(user.rol===2){
        router.push('/cupon');
      }else{
        router.push('/');
      }

    }
  },);
  const theme = useTheme();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (e) => {
    console.log('emailRef', emailRef.current.value)
    console.log('passwordRef', passwordRef.current.value)
    try {
      const data = await LoginUsuario(emailRef.current.value, passwordRef.current.value);

      console.log(data)
      loginUser(data)
      // Realizar acciones con los datos de respuesta exitosa, como redireccionar o establecer tokens en el estado, etc.
    } catch (err) {
      console.log("error dentro de try cathc")
      console.log(err.code)
      // Mostrar un toast de error en caso de que el código sea "2"
      toast.error("Error durante el proceso de login", {
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

  const handleClickForgottenPassword = async (e) =>{

    navigate('/ForgottenPassword')
  }


  const renderForm = (
    <>
    <Stack spacing={3}>
        <TextField inputRef={emailRef} name="email" label="Correo" />
        <TextField
          inputRef={passwordRef}
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
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
    </Stack>
    <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ my: 3 }}>
      <Link variant="subtitle2" onClick={handleClickForgottenPassword} underline="hover" style={{ color: "#003B91", fontWeight: "bold" }}>
        ¿Olvidó su contraseña?
      </Link>
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
        Iniciar Sesión
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
            <Typography variant="h4">Iniciar Sesión</Typography>
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
