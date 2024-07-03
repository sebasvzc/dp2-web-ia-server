
const obtenerNotificaciones = async (page,pageSize,searchName) => {
  try {
    const notificacionData = await getNotificaciones(page,pageSize,searchName); // Obtener los notificaciones de manera asíncrona
    console.log('Notificaciones obtenidos:', notificacionData);
    // Puedes hacer más cosas con los datos de notificaciones si es necesario
    return notificacionData; // Devolver los datos de notificaciones obtenidos
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a obtenerNotificaciones
  }
};

const getNotificaciones = async (page,pageSize,searchName) => {
  try {
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    console.log(userStringify.token);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;

    
    const response = await fetch(`http://localhost:3000/api/notifications/listarNotificacion?page=${page}&pageSize=${pageSize}&searchName=${searchName}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    console.log(response);

    if(response.status===403 || response.status===401){
        localStorage.removeItem('user');
        window.location.reload();
    }
    if (!response.ok) {

      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {

    console.error('Error fetching users:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a getUsers
  }
};

export default obtenerNotificaciones;