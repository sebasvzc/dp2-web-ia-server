import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker,LocalizationProvider  } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import AppCurrentVisits from '../app-current-visits';
import FictionBooksSalesChart from '../FictionBooksSalesChart';
import { getCategoriaTiendas } from '../../../funciones/api';
import {
  getEdadEventosPorc,
  getGeneroEventosPorc, getJuegosRAPorc,
  getPersonasAsistente,
  getPuntosEventosAsitencia,
  getPuntosTiendasAsitencia, getUsersPlayRA,
} from '../../../funciones/apiDashboard';
import DashboardGeneralGeneroEvento from '../DashboardGeneralGeneroEvento';
import DashboardGeneralBarCategAsist from '../DashboardGeneralBarCategAsist';
import './AppWidgetSummary.css';
import DashboardGeneralEdadEvento from '../DashboardGeneralEdadEvento';
import DashboardGeneralJuegosGeneral from '../DashboardGeneralJuegosGeneral';
// Importar localización española

dayjs.locale('es-mx');
// ----------------------------------------------------------------------

export default function AppView() {
  const [selectedOption, setSelectedOption] = useState('top10mayor');
  const [selectedOptionCateg, setSelectedOptionCateg] = useState('top10mayorCateg');
  const [loading, setLoading] = useState(true);
  const [lastSelectedIndex, setLastSelectedIndex] = useState("");
  const [numPersonasEventos, setNumPersonasEventos] = useState(0);
  const [usuariosRa, setUsuariosRa] = useState(0);
  const [puntosEventosAsist, setPuntosEventosAsist] = useState(0);
  const [dataDashGenero, setDataDashGenero] = useState({  name:"",categoria: [], data: []  });
  const [dataDashEdad, setDataDashEdad] = useState({  name:"",categoria: [], data: []  });
  const [dataDashJuego, setDataDashJuego] = useState({  name:"",categoria: [], data: []  });
  const [puntosTiendasAsist, setPuntosTiendasAsist] = useState(0);
  const [loadingVisitasTiendas, setLoadingVisitasTiendas] = useState(true);
  const [loadingVisitasCategorias, setLoadingVisitasCategorias] = useState(true);
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleChangeCateg = (event) => {
    setSelectedOptionCateg(event.target.value);
  };
  const handleClickBar = (e) => {
    // setSearchName(e)
    // setPage(1);


      console.log(e)


  };

  const [startDate, setStartDate] = useState(dayjs().startOf('year'));
  const [endDate, setEndDate] = useState(dayjs());
  const [dataDash, setDataDash] = useState({  nombreTienda: [], cantidades: [] });
  const [dataDashCategAssist, setDataDashCategAssist] = useState({  categoriaTiendas: [], cantidades: [] });
  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadInitialData() {
      console.log("CuponData")
      setLoading(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const endDateParam=`${endDate.date()}/${endDate.month()+1}/${endDate.year()}`;
        const startDateParam=`${startDate.date()}/${startDate.month()+1}/${startDate.year()}`;
        // Simulación de carga
        let response="";
        response = await fetch(`http://localhost:3000/api/tiendas/getTopTiendasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if(data.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data) {
          console.log("Viendo data5");
          console.log(data);
          console.log("Fechas y canjeados y usados:");
          const nombreTiendasArray = data.resultadoTopTiendas.map(item => item.NombreTienda);
          const cantidadesArray = data.resultadoTopTiendas.map(item => item.cantidad);


          console.log(JSON.stringify(nombreTiendasArray));

          setDataDash({ nombreTiendas: nombreTiendasArray, cantidades: cantidadesArray });

        }

        response = await fetch(`http://localhost:3000/api/categoriaTienda/getTopCategoriasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data2 = await response.json();
        if(data2.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data2.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data2) {
          console.log("Viendo data2");
          console.log(data2);
          console.log("Fechas y canjeados y usados:");
          const categoriaTiendasArray = data2.resultado.map(item => item.nombre_categoria);
          const cantidadesCatArray = data2.resultado.map(item => item.cantidad_escaneos);


          console.log(JSON.stringify(categoriaTiendasArray));

          setDataDashCategAssist({ categoriaTiendas: categoriaTiendasArray, cantidades: cantidadesCatArray });

        }


        const resultsGeneroEventosPorc =  await getGeneroEventosPorc(token,refreshToken,endDateParam,startDateParam);
        const generoArray = resultsGeneroEventosPorc.map(item => item.genero);
        const cantidadGeneroArray = resultsGeneroEventosPorc.map(item => item.cantidad);
        console.log("JSON.stringify(generoArray)");
        console.log(JSON.stringify(generoArray));
        console.log(JSON.stringify(cantidadGeneroArray));
        setDataDashGenero({ categoria: generoArray, data: cantidadGeneroArray });

        const resultsEdadEventosPorc =  await getEdadEventosPorc(token,refreshToken,endDateParam,startDateParam);
        const edadArray = resultsEdadEventosPorc.map(item => item.rango);
        const cantidadEdadArray = resultsEdadEventosPorc.map(item => item.conteo);
        console.log("JSON.stringify(edadArray)");
        console.log(JSON.stringify(edadArray));
        console.log(JSON.stringify(cantidadEdadArray));
        setDataDashEdad({ categoria: edadArray, data: cantidadEdadArray });

        const resultsJuegosRAPorc =  await getJuegosRAPorc(token,refreshToken,endDateParam,startDateParam);
        console.log(resultsJuegosRAPorc);
        const juegoArray = resultsJuegosRAPorc.rango.map(item => item.nombreJuego);
        const cantidadJuegoArray = resultsJuegosRAPorc.rango.map(item => item.cantidad);
        console.log("JSON.stringify(juegoArray)");
        console.log(JSON.stringify(juegoArray));
        console.log(JSON.stringify(cantidadJuegoArray));
        setDataDashJuego({ categoria: juegoArray, data: cantidadJuegoArray });



        const resultsPersonasAsistentes =  await getPersonasAsistente(token,refreshToken,endDateParam,startDateParam);
        console.log("resultsPersonasAsistentes");
        console.log(resultsPersonasAsistentes);
        setNumPersonasEventos(resultsPersonasAsistentes.cantidad);

        const resultsPuntosEventosAsitencia=  await getPuntosEventosAsitencia(token,refreshToken,endDateParam,startDateParam);
        console.log("resultsPuntosEventosAsitencia")
        console.log(resultsPuntosEventosAsitencia.totalPuntosOtorgadosEvento)

          setPuntosEventosAsist(resultsPuntosEventosAsitencia.totalPuntosOtorgadosEvento);



        const resultsTiendasAsitencia =  await getPuntosTiendasAsitencia(token,refreshToken,endDateParam,startDateParam);
        setPuntosTiendasAsist(resultsTiendasAsitencia.totalPuntosOtorgadosTienda);

        const resultsUsersPlayRA =  await getUsersPlayRA(token,refreshToken,endDateParam,startDateParam);

        setUsuariosRa(resultsUsersPlayRA.cantidad);
        setTimeout(() => {
          setLoading(false);
        }, 1000); // Espera 1 segundo antes de poner setLoading(false)

      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoading(false);
      }
    }

    loadInitialData();

  }, [endDate,startDate]);

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadChangeVistiaData() {

      setLoadingVisitasTiendas(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const endDateParam=`${endDate.date()}/${endDate.month()+1}/${endDate.year()}`;
        const startDateParam=`${startDate.date()}/${startDate.month()+1}/${startDate.year()}`;
        // Simulación de carga
        let response="";
        console.log("selectedOption")
        console.log(selectedOption)
        if(selectedOption==="top10mayor"){
          response = await fetch(`http://localhost:3000/api/tiendas/getTopTiendasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

          });
        }else{
          response = await fetch(`http://localhost:3000/api/tiendas/getBottomTiendasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

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
        if(data.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data) {
          console.log("Viendo data5");
          console.log(data);
          console.log("Fechas y canjeados y usados:");
          const nombreTiendasArray = data.resultadoTopTiendas.map(item => item.NombreTienda);
          const cantidadesArray = data.resultadoTopTiendas.map(item => item.cantidad);


          console.log(JSON.stringify(nombreTiendasArray));

          setDataDash({ nombreTiendas: nombreTiendasArray, cantidades: cantidadesArray });

        }


        setTimeout(() => {
          setLoadingVisitasTiendas(false);
        }, 1000); // Espera 1 segundo antes de poner setLoading(false)

      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoadingVisitasTiendas(false);
      }
    }

    loadChangeVistiaData();

  }, [endDate,startDate,selectedOption]);

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadChangeVistiaCategData() {

      setLoadingVisitasCategorias(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const endDateParam=`${endDate.date()}/${endDate.month()+1}/${endDate.year()}`;
        const startDateParam=`${startDate.date()}/${startDate.month()+1}/${startDate.year()}`;
        // Simulación de carga
        let response="";
        console.log("selectedOptionCateg")
        console.log(selectedOptionCateg)
        if(selectedOptionCateg==="top10mayorCateg"){
          response = await fetch(`http://localhost:3000/api/categoriaTienda/getTopCategoriasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

          });
        }else{
          response = await fetch(`http://localhost:3000/api/categoriaTienda/getBottomCategoriasAsist?endDate=${endDateParam}&startDate=${startDateParam}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

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
        if(data.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data) {
          console.log("Viendo data5");
          console.log(data);
          console.log("LoadNuevo:");
          const nombreTiendasArray = data.resultado.map(item => item.nombre_categoria);
          const cantidadesArray = data.resultado.map(item => item.cantidad_escaneos);


          console.log(JSON.stringify(nombreTiendasArray));

          setDataDashCategAssist({ categoriaTiendas: nombreTiendasArray, cantidades: cantidadesArray });

        }


        setTimeout(() => {
          setLoadingVisitasCategorias(false);
        }, 1000); // Espera 1 segundo antes de poner setLoading(false)

      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoadingVisitasCategorias(false);
      }
    }

    loadChangeVistiaCategData();

  }, [endDate, startDate, selectedOptionCateg]);

  function AppWidgetSummary({ title, total, icon }) {
    return (
      <Card className="styled-card">
        <CardContent className="card-content">
          <div className="icon-wrapper">{icon}</div>
          <div className="text-content">
            <Typography variant="h3" className="number-typography">{total}</Typography>
            <Typography variant="h5" className="title-typography">{title}</Typography>
          </div>
        </CardContent>
      </Card>
    );
  } 

  AppWidgetSummary.propTypes = {
    title: PropTypes.string.isRequired, // Debe ser una cadena y es obligatorio
    total: PropTypes.number.isRequired, // Debe ser un número y es obligatorio
    icon: PropTypes.element.isRequired, // Debe ser un elemento React y es obligatorio
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
            <Card>
              <CardHeader title={<Typography variant="h3">Rango de fechas</Typography>} />
              <CardContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={2}>
                      <DatePicker
                        label="Fecha inicial"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        views={['year', 'month']}
                        openTo="month"
                        maxDate={endDate || undefined} // Deshabilitar fechas después de la fecha final
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                      <DatePicker
                        label="Fecha final"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        views={['year', 'month']}
                        openTo="month"
                        minDate={startDate || undefined} // Deshabilitar fechas antes de la fecha inicial
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </CardContent>
            </Card>
          </Grid>
        <Grid item xs={12} sm={12} md={12} container >

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: '25%',
              marginTop: '15%', // Ajusta la distancia desde la parte superior
              marginBottom: '15%',

              width: '100%',
            }}
          >
            <CircularProgress color="primary" />
            <Typography variant="h6" sx={{ mt: 1 }}>
              Cargando...
            </Typography>
          </Box>
        ):(
        <Box  >
          <Grid xs={12} md={12} lg={12} container spacing={2}>
            <Grid xs={12} sm={12} md={6} lg={6} item container >
                  <Grid item xs={12} sm={6} md={6}>
                    <AppWidgetSummary
                      title="Número de personas que han asistido a un evento"
                      total={Number(numPersonasEventos) || 0}
                      icon={<img alt="icon" src="/assets/icons/glass/ic_clientes.png" className="icon" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppWidgetSummary
                      title="Número de usuarios que han interactuado con la aplicación RA"
                      total={Number(usuariosRa) || 0}
                      icon={<img alt="icon" src="/assets/icons/glass/ic_RAMobile.png" className="icon" />}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={6}>
                      <AppWidgetSummary
                        title="Número puntos generados por escaneo y asistencia a eventos"
                        total={Number(puntosEventosAsist) || 0}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_Points.png" className="icon"/>}
                      />
                  </Grid>
                  <Grid xs={12} sm={6} md={6}>
                      <AppWidgetSummary
                        title="Número puntos generados por escaneo y asistencia a tiendas"
                        total={Number(puntosTiendasAsist) || 0}
                        icon={<img alt="icon" src="/assets/icons/glass/ic_Points.png" className="icon" />}
                      />
                  </Grid>
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6} item container >
              <Grid xs={12} sm={12} md={12} lg={12} item >
                <Card
                  sx={{
                    px: 3,
                    py: 5,
                    borderRadius: 2,
                  }} >
                  <DashboardGeneralJuegosGeneral dataDash={dataDashJuego}/>
                </Card>
              </Grid>

            </Grid>
          <Grid xs={12} sm={12} md={4} lg={4} item container >

              <Grid xs={12} sm={12} md={12} lg={12} item >
                <Card
                  sx={{
                    px: 3,
                    py: 5,
                    borderRadius: 2,
                  }} >
                <DashboardGeneralGeneroEvento dataDash={dataDashGenero}/>
                </Card>
              </Grid>

          </Grid>
            <Grid xs={12} sm={12} md={8} lg={8} item container >

              <Grid xs={12} sm={12} md={12} lg={12} item >
                <Card
                  sx={{
                    px: 3,
                    py: 5,
                    borderRadius: 2,
                  }} >
                  <DashboardGeneralEdadEvento dataDash={dataDashEdad}/>
                </Card>
              </Grid>

        </Grid>
        </Grid>


          <Grid xs={12} sm={12} md={12} lg={12} container spacing={2} >
              <Grid item xs={12} md={6} lg={6} container >
                    <Grid item xs={12} md={12} lg={12}>
            <Card
              sx={{
                px: 3,
                py: 5,
                borderRadius: 2,
              }} >
              <Grid item xs={12} sm={12} md={12} >
                <Typography variant="h4" sx={{ mt: 1 }}>
                  Visitas a Tiendas
                </Typography>
              </Grid>
            <Grid  item xs={4}>
              <Select
                defaultValue="top10mayor"
                value={selectedOption}  // Establece aquí el valor seleccionado por defecto
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="top10mayor">Primeros 10</MenuItem>
                <MenuItem value="top10menor">Últimos 10</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              {loadingVisitasTiendas ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: 460,
                    marginTop: '15%', // Ajusta la distancia desde la parte superior
                    marginBottom: '15%',
                  }}
                >
                  <CircularProgress color="primary" />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Cargando...
                  </Typography>
                </Box>
              ):(
                <FictionBooksSalesChart dataDash={dataDash} />
              )}



            </Grid>
            </Card>
            </Grid>
             </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} container >


                <Grid item xs={12} md={12} lg={12}>
                  <Card
                    sx={{
                      px: 3,
                      py: 5,
                      borderRadius: 2,
                    }} >
                    <Grid item xs={12} sm={12} md={12} >
                      <Typography variant="h4" sx={{ mt: 1 }}>
                        Visitas a Tiendas por Categorias de Tiendas
                      </Typography>
                    </Grid>
                    <Grid  item xs={4}>
                      <Select
                        defaultValue="top10mayorCateg"
                        value={selectedOptionCateg}  // Establece aquí el valor seleccionado por defecto
                        onChange={handleChangeCateg}
                        fullWidth
                      >
                        <MenuItem value="top10mayorCateg">Primeros 10</MenuItem>
                        <MenuItem value="top10menorCateg">Últimos 10</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} >
                      {loadingVisitasCategorias ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            height: 460,
                            marginTop: '15%', // Ajusta la distancia desde la parte superior
                            marginBottom: '15%',
                          }}
                        >
                          <CircularProgress color="primary" />
                          <Typography variant="h6" sx={{ mt: 1 }}>
                            Cargando...
                          </Typography>
                        </Box>
                      ):(
                        <DashboardGeneralBarCategAsist dataDash={dataDashCategAssist}/>
                      )}



                    </Grid>
                  </Card>
                </Grid>
              </Grid>


          </Grid>


        </Box>

        )}

        </Grid>
      </Grid>


    </Container>
  );
}
