export async function getTiendas(token, refreshToken, searchTerm) {
  try {
    let response="";
    console.log(searchTerm)
    if(searchTerm==="" || searchTerm === undefined){
      response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=all&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }else{
      response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=${searchTerm}&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }


    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cupones:', error);
    throw error;
  }
}

export async function getTipoCupones(token, refreshToken, searchTermTipoCupones) {
  try {

    let response="";
    if(searchTermTipoCupones==="" || searchTermTipoCupones === undefined){
      response = await fetch(`http://localhost:3000/api/tipocupones/listartipocupones?query=all&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }else{
      response = await fetch(`http://localhost:3000/api/tipocupones/listartipocupones?query=${searchTermTipoCupones}&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }


    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cupones:', error);
    throw error;
  }
}

export async function getCategoriaTiendas(token, refreshToken, searchTerm) {
  try {

    let response="";
    console.log(searchTerm)
    if(searchTerm==="" || searchTerm === undefined){
      response = await fetch(`http://localhost:3000/api/categoriaTienda/listarCategoriaTiendasWeb?query=all&page=1&pageSize=40`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }else{
      response = await fetch(`http://localhost:3000/api/categoriaTienda/listarCategoriaTiendasWeb?query=${searchTerm}&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }


    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    throw error;
  }
};

export async function getTipoEventos(token, refreshToken, searchTerm) {

  try {
    let response="";
    console.log("Viendo get tipo eventos:", searchTerm)
    if(searchTerm==="" || searchTerm===undefined ){
      response = await fetch(`http://localhost:3000/api/tipoEvento/listarTipoEvento?query=all&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }else{
      response = await fetch(`http://localhost:3000/api/tipoEvento/listarTipoEvento?query=${searchTerm}&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }


    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cupones:', error);
    throw error;
  }
};

export async function getLugarEvento(token, refreshToken, searchTerm) {
  try {
    let response="";
    if(searchTerm==="" || searchTerm===undefined ){
      response = await fetch(`http://localhost:3000/api/lugares/listarLugares?query=all&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }else{
      response = await fetch(`http://localhost:3000/api/lugares/listarLugares?query=${searchTerm}&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }


    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cupones:', error);
    throw error;
  }
};

export async function getTiendaEvento(token, refreshToken, searchTerm) {
  try {
    let response="";
    if(searchTerm==="" || searchTerm===undefined ){
      response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=all&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }else{
      response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=${searchTerm}&page=1&pageSize=10`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });
    }


    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cupones:', error);
    throw error;
  }
};