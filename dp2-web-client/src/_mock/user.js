
const obtenerUsuarios = async (page,pageSize,searchName) => {
  try {
    const userData = await getUsers(page,pageSize,searchName); // Obtener los usuarios de manera asíncrona
    console.log('Usuarios obtenidos:', userData);
    // Puedes hacer más cosas con los datos de usuarios si es necesario
    return userData; // Devolver los datos de usuarios obtenidos
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a obtenerUsuarios
  }
};

const getUsers = async (page,pageSize,searchName) => {
  try {
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    console.log(userStringify.token);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;

    if(searchName===""){
      searchName="all";
    }
    const response = await fetch(`http://localhost:3000/api/user/listusers?query=${searchName}&page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`
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

export default obtenerUsuarios;