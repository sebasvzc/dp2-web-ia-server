import { toast } from 'react-toastify';

const LoginUsuario = async (email, password) => {
  try {
    console.log("LoginUsuario", email, password)
    const response = await fetch('http://localhost:3000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }) // Propiedad abreviada
    });

    const responseData  = await response.json();

    if (!response.ok) {
      if (responseData.code === "2") {
        toast.error("El usuario se encuentra deshabilitado. Por favor, contacte con el administrador.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        throw new Error(responseData.code); // Lanzar un error con el mensaje del servidor
      } else {
        throw new Error('Network response was not ok');
      }
    }


    return responseData ;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a getUsers
  }
};

export default LoginUsuario;