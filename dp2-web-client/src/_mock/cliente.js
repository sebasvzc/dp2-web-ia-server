
const obtenerClientes = async (page,pageSize,searchName) => {
  try {
    console.log('HOLA ENTRE A OBTENER CLIENTES')
    const userData = await getUsers(page,pageSize,searchName); // Obtener los clientes de manera asíncrona
    console.log('Clientes obtenidos:', userData);
    // Puedes hacer más cosas con los datos de clientes si es necesario
    return userData; // Devolver los datos de clientes obtenidos
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error; // Lanzar el error para manejarlo en el componente que llama a obtenerClientes
  }
};

const getUsers = async (page,pageSize,searchName) => {
  try {
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    console.log(userStringify.token);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;

    console.log("Este es el primer valor de  searchText")
    console.log(searchName)
   
    if(searchName==="all"){searchName=""}
    
    const response = await fetch(`http://localhost:3000/api/client/listarClientesActivos?page=${page}&pageSize=${pageSize}`, {
      method: 'POST',
      headers: {
        
        'Accept': 'application/json',
        'Content-Type':'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      },
      body: JSON.stringify({ searchText :searchName })
      
    });
    console.log("Esta es la respuesta")
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

export default obtenerClientes;