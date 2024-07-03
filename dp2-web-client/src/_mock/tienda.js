
const obtenerTiendas = async (page,pageSize,searchName) => {
  try {
    const tiendaData = await getTiendas(page,pageSize,searchName); // Obtener los usuarios de manera asíncrona
    console.log('Tiendas obtenidos:', tiendaData);
    // Puedes hacer más cosas con los datos de usuarios si es necesario
    return tiendaData; // Devolver los datos de usuarios obtenidos
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a obtenerTiendas
  }
};

const getTiendas = async (page,pageSize,searchName) => {
  try {
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    console.log(userStringify.token);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;
    
    if(searchName===""){
      searchName="all";
    }
    const response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=${searchName}&page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });
    console.log(response);

    if(response.status===403 || response.status===401){
        localStorage.removeItem('tienda');
        window.location.reload();
    }
    if (!response.ok) {

      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {

    console.error('Error fetching tiendas:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a getTiendas
  }
};

export default obtenerTiendas;