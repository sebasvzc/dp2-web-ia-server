export async function getPersonasAsistente(token, refreshToken, endDateParam,startDateParam) {
  try {

    let response="";
      response = await fetch(`http://localhost:3000/api/eventos/getPersonasAsistente?startDate=${startDateParam}&endDate=${endDateParam}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Refresh-Token': `Bearer ${refreshToken}`
        }
      });



    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : { totalPuntosOtorgadosEvento: 0 };  // Maneja el caso donde el cuerpo de la respuesta está vacío
    return data;
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    throw error;
  }
};

export async function getGeneroEventosPorc(token, refreshToken, endDateParam,startDateParam) {
  try {

    let response="";
    response = await fetch(`http://localhost:3000/api/eventos/getGeneroPorcEventos?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });



    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data= await response.json();// Maneja el caso donde el cuerpo de la respuesta está vacío

    return data;
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    throw error;
  }
};

export async function getEdadEventosPorc(token, refreshToken, endDateParam,startDateParam) {
  try {

    let response="";
    response = await fetch(`http://localhost:3000/api/eventos/getEdadPorcEventos?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });



    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data= await response.json();// Maneja el caso donde el cuerpo de la respuesta está vacío

    return data;
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    throw error;
  }
};

export async function getJuegosRAPorc(token, refreshToken, endDateParam,startDateParam) {
  try {

    let response="";
    response = await fetch(`http://localhost:3000/api/user/getJuegosRAPorc?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });



    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data= await response.json();// Maneja el caso donde el cuerpo de la respuesta está vacío

    return data;
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    throw error;
  }
};

export async function getPuntosEventosAsitencia(token, refreshToken, endDateParam,startDateParam) {
  try {

    let response="";
    response = await fetch(`http://localhost:3000/api/eventos/getPuntosEventosAsitencia?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });



    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : { totalPuntosOtorgadosEvento: 0 };  // Maneja el caso donde el cuerpo de la respuesta está vacío

    return data;
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    throw error;
  }
};

export async function getPuntosTiendasAsitencia(token, refreshToken, endDateParam,startDateParam) {
  try {

    let response="";
    response = await fetch(`http://localhost:3000/api/tiendas/getPuntosTiendasAsitencia?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });



    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : { totalPuntosOtorgadosEvento: 0 };  // Maneja el caso donde el cuerpo de la respuesta está vacío

    return data;
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    throw error;
  }
};

export async function getUsersPlayRA(token, refreshToken, endDateParam,startDateParam) {
  try {

    let response="";
    response = await fetch(`http://localhost:3000/api/user/getUsersPlayRA?startDate=${startDateParam}&endDate=${endDateParam}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });



    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem('user');
      window.location.reload();
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : { cantidad: 0 };
    return data;
  } catch (error) {
    console.error('Error fetching tiendas:', error);
    throw error;
  }
};