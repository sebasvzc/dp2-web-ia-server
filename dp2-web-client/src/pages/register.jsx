import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';

import { RegisterView } from 'src/sections/register';



// import obtenerUsuarios from '../_mock/user';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    const fetchData = async (token2) => {
      try {
        console.log(token2);
        console.log("validadndo token2");
        const response = await fetch('http://localhost:3000/api/user/comprobarTokenRegistro', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

          },
          body: JSON.stringify({ tokenReg:token2 })
        });
        console.log(response);

        if (!response.ok) {
          console.error('Network response was not ok');
          navigate('/login');
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {

        console.error('Error validating token:', error);
        navigate('/login');
      }
    };

    fetchData(token);
    if (!token ) {
      navigate('/login');
    }
  }, [location.search, navigate]);

  return (
    <>
      <Helmet>
        <title> Registrarse </title>
      </Helmet>

      <RegisterView />

    </>
  );
}
