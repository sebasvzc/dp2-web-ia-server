import dayjs from 'dayjs';
import * as React from 'react';
import utc from 'dayjs/plugin/utc';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ListSubheader from '@mui/material/ListSubheader';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import InfoIcon from '@mui/icons-material/Info';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Tab,
  Grid,
  Chip,
  Tabs,
  Select,
  MenuItem,
  IconButton,
  Button,
  Modal,
  TextField,InputLabel, FormControl, createTheme, ThemeProvider
} from '@mui/material';  // Extiende dayjs con el plugin UTC
// Importa el plugin UTC para manejar correctamente las fechas UTC
import Card from '@mui/material/Card';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Iconify from '../../../components/iconify';
import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs';
import DashboardAsistentes from '../../overview/DashboardAsistentes';
import DashboardGeneroEdad from '../../overview/DashboardGeneroEdad';
import DashboardEventosAsistentes from '../../overview/DashboardEventosAsistentes';
import { getTipoEventos,getLugarEvento,getTiendaEvento, } from '../../../funciones/api';

dayjs.extend(utc);

export default function EventoDetail() {
  const [view, setView] = useState('datos');
  const { id: idParam } = useParams();
  const [editable, setEditable] = useState(false);
  const [editableImg, setEditableImg] = useState(false);
  const [order, setOrder] = useState('asc');
  const [searchName, setSearchName] = useState("all");
  const [dataClients, setDataClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habilitarEventos, setHabilitarEventos] = useState(true);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [activo,setActivo]=useState(false)
  const [orderBy, setOrderBy] = useState('id');
  const [urlImagenS3 , setUrlImagenS3] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const filterName= useState("")
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [dataDashEventos, setDataDashEventos] = useState({ totalAsistencia: 1, totalInscritos: 1});
  const [dataDashEventosAgrupEdadAsist, setDataDashEventosAgrupEdadAsist] = useState([]);
  const [totalClientsEvento, setTotalClientsEvento] = useState(10);
  const [codigoText, setCodigoText] = useState('');
  const [nombreText, setNombreText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [puntosOtorgadosText, setPuntosOtorgadosText] = useState('');
  const [selectedLugar, setSelectedLugar] = useState('');
  const [selectedEvento, setSelectedEvento] = useState('');

  const [files, setFiles] = React.useState([]);
  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  };
  const previewImage = document.querySelector("#previewImage");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState('');
  const [tiendas, setTiendas] = useState([]);
  const [selectedTienda, setSelectedTienda] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLugar, setSearchLugar] = useState('');
  const [searchTienda, setSearchTienda] = useState('');
  const [tipoEventos, setTipoEventos] = useState([]);
  const [selectedTipoEvento, setSelectedTipoEvento] = useState('');
  const [searchTermTipoEventos, setSearchTermTipoEventos] = useState('');
  const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`;
  const navigate=useNavigate();

  const [eventos, setEventos] = useState([]);
  const [lugar, setLugar] = useState([]);
  const [tienda, setTienda] = useState([]);

  const [open, setOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const handleBack = () => {
    navigate('/evento'); 
  }

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadEventoData(searchTerm) {
      console.log("EventoData")
      setLoading(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        console.log(idParam)
        // Simulación de carga
        let response="";
        response = await fetch(`http://localhost:3000/api/eventos/detalleEventoCompleto`, {
          method: 'POST',
          body: JSON.stringify({
            id:idParam,
            permission:"Gestion de Eventos"
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }
        if(response.status===404){
          navigate('/evento');
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const resultsTipo =  await getTipoEventos(token,refreshToken,searchTerm);
        console.log("viendo eventos uwu", resultsTipo.tipoEventos)
        setEventos(resultsTipo.tipoEventos);

        const resultsTienda =  await getTiendaEvento(token,refreshToken,searchTerm);
        console.log("viendo tiendas uwu", resultsTienda.tiendas)
        setTienda(resultsTienda.tiendas);

        const resultsLugar =  await getLugarEvento(token,refreshToken,searchTerm);
        console.log("viendo luagres uwu", resultsLugar.lugares)
        setLugar(resultsLugar.lugares);

        const data = await response.json();
        console.log(data)

        if(data.detalles.activo===true){
          setActivo("Activo")
        }
        else{
          setActivo("Baneado")
        }
        console.log("Datos: ",data.detalles)

        setCodigoText(data.detalles.codigo)
        setNombreText(data.detalles.nombre)
        setUrlImagenS3(data.image)
        setDescripcionText(data.detalles.descripcion)
        setPuntosOtorgadosText(data.detalles.puntosOtorgados)
        setStartDate(dayjs(data.detalles.fechaInicio).utc(true))
        setEndDate(dayjs(data.detalles.fechaFin).utc(true))
        setUrlImagenS3(data.image);

        console.log("Datos de data:", data.detalles)
        setSelectedEvento(data.detalles.tipoEvento.id)
        setSelectedLugar(data.detalles.lugar.id)
        setSelectedTienda(data.detalles.locatario.id)

        console.log(idParam)

        let responseEventoAsist="";
        responseEventoAsist = await fetch(`http://localhost:3000/api/eventos/listarAsistencia?idParam=${idParam}`, {
          method: 'GET',

          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (responseEventoAsist.status === 403 || responseEventoAsist.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!responseEventoAsist.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("Evento Asistnecia")
        const data6 = await responseEventoAsist.json();
        console.log(data6)
        if(data6.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data6.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data6) {
          console.log("Viendo asistencia de evento");
          console.log(data6);

        }
        setDataDashEventos({ totalAsistencia: data6.totalAsistio, totalInscritos: data6.totalEventos})
        
        let responseEventoAsistAgrupEdad="";
        responseEventoAsistAgrupEdad = await fetch(`http://localhost:3000/api/eventos/asitenciaXGeneroAgrupEdad?idParam=${idParam}`, {
          method: 'GET',

          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        if (responseEventoAsistAgrupEdad.status === 403 || responseEventoAsistAgrupEdad.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }
        
        if (!responseEventoAsistAgrupEdad.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("Evento Asistnecia")
        const data10 = await responseEventoAsistAgrupEdad.json();
        console.log(data10)
        if(data10.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data10.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data10) {
          console.log("Viendo asistencia de evento agrupada por edad y genero");
          console.log(data10);

        }
        setDataDashEventosAgrupEdadAsist(data10)
        setLoading(false);
      }catch (err) {
        console.error("Failed to fetch cupon data", err);
        setLoading(false);
      }
    }
      loadEventoData();
  }, [idParam, navigate, page, pageSize, searchName]);

  const [formDatos, setFormDatos] = useState({
    tipo: "evento",  
    idReferencia: idParam,
  });

  const handleOpen = async (event) => {
    event.preventDefault();
    try {
      const user = localStorage.getItem('user');
      const userStringify = JSON.parse(user);
      const { token, refreshToken } = userStringify;
      const formData = new FormData();
      formData.append("tipo", "evento");
      formData.append("idReferencia", idParam);
      
      const response = await fetch(`http://localhost:3000/api/qr/generar`, {
        method: 'POST',
        body: JSON.stringify(formDatos),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setQrCode(data.qrCode);  // Almacenar el código QR en el estado
      setOpen(true);  // Abrir el modal

      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('user');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching crear QR:', error);
      throw error;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrCode.png';
    link.click();
  };


  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleSubmit = async (event) => {
    console.log("funciona")
  };

  const handleChangeImage = async (e) => {
    e.preventDefault();
    setEditableImg(true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getTipoEventos(token,refreshToken,searchTerm);
    console.log("viendo resultados", results.tipoEventos)
    setEventos(results.tipoEventos);
  };

  const changeLugarSearch = async (e) => {
    e.preventDefault();
    setSearchLugar(e.target.value)
  };
  
  const handleLugarEvento = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getLugarEvento(token,refreshToken,searchLugar);
    // console.log("viendo lugares", results.lugares)
    setLugar(results.lugar);
  };

  const changeTiendaSearch = async (e) => {
    e.preventDefault();
    setSearchTienda(e.target.value)
  };
  
  const handleTiendaEvento = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getTiendaEvento(token,refreshToken,searchTienda);
    // console.log("viendo tiendas", results.tiendas)
    setTienda(results.locatario);
  };

  const fetchAndSetView = async (newView) => {
    try {
      // Simulando una llamada a la API
      const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const data = await response.json();

      // Procesa la data aquí si es necesario
      console.log('Datos recibidos de la API:', data);

      // Cambia la vista
      setView(newView);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    console.log("Este es el id que ordena")
    console.log(id)
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    console.log("newSelected");
    console.log(newSelected);
    console.log(typeof newSelected);
  };
  const handleSelectAllClick = (event) => {

    console.log(searchName)
    if (event.target.checked) {
      const newSelecteds = dataClients.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleChangePage = (event, newPage) => {
    console.log("new page", newPage+1)
    setPage(newPage+1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(1);
    setPageSize(parseInt(event.target.value, 10));
  };

  console.log("Valor de activo:", activo);
  const isActivo = activo === "Activo";

  const changeTermSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value)
  };

  const handleSeleccionVisualizar = (event, newValue) => {
    if (newValue === 'datos') {
      setView('datos');
    } else if (newValue === 'estadisticas') {
      fetchAndSetView('estadisticas');
    }
  };

  const theme = createTheme({
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#1976d2', // Color del indicador
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            minWidth: 72,
            fontWeight: 'bold',
            marginRight: 20,
            fontFamily: [
              '-apple-system',
              'BlinkMacSystemFont',
              '"Segoe UI"',
              'Roboto',
              '"Helvetica Neue"',
              'Arial',
              'sans-serif',
              '"Apple Color Emoji"',
              '"Segoe UI Emoji"',
              '"Segoe UI Symbol"',
            ].join(','),
            '&:hover': {
              color: '#40a9ff',
              opacity: 1,
            },
            '&.Mui-selected': {
              color: '#1890ff',
              fontWeight: 'bold',
            },
            '&:focus': {
              color: '#40a9ff',
            },
          },
        },
      },
    },
  });

  return (
    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <BasicBreadcrumbs />
      <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
          <ArrowBackIosIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" >Visualizar Evento</Typography>
      </Stack>
      <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
      <Grid container spacing={5}  >
        <Grid item xs={3}>
          <ThemeProvider theme={theme}>
            <Tabs
              value={view}
              onChange={handleSeleccionVisualizar}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              aria-label="pestañas de navegación"
            >
              <Tab label={<Typography variant="h5" sx={{ fontWeight: 'bold' }}>Datos</Typography>} value="datos" />
              <Tab label={<Typography variant="h5" sx={{ fontWeight: 'bold' }}>Estadísticas</Typography>} value="estadisticas" />
            </Tabs>
          </ThemeProvider>
        </Grid>
        <Grid item xs={12}>
          {view === 'datos' ? (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Box display="flex" justifyContent="flex-end" alignItems="center" />
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
                  }}
                >
                  <CircularProgress color="primary" />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Cargando...
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Grid item xs={12} sx={{ paddingBottom: '2%', paddingTop:'0%', paddingRight: '0%'}}>
                    <Box display="flex" alignItems="center" sx={{ paddingLeft: '2%'}}>
                    <Typography variant="h3" component="div" sx={{ marginRight: 2 }}>
                        {nombreText}
                      </Typography>
                      <Chip
                        label={isActivo ? "Evento Activo" : "Evento Inactivo"}
                        color={isActivo ? "success" : "default"}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>
                  <Box  sx={{ borderRadius: '8px',  padding: '2%' , paddingTop: '0%' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4} >
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{
                            border: '1px solid',
                            borderColor: '#A6B0BB',
                            borderRadius: '8px',
                            width: '100%', // Ancho fijo del contenedor
                            height: '350px', // Alto fijo del contenedor
                            overflow: 'hidden', // Oculta el contenido que se sale del contenedor
                          }}>
                          <Box
                            position="relative"
                            width="100%"
                            maxWidth="300px"
                            style={{ width: '100%', height: 'auto'}}
                          >
                            <img
                              src={urlImagenS3}
                              alt="Imagen Predeterminada"
                              style={{ width: '100%', height: 'auto' }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={8} container spacing={2}>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Código" name="codigo" 
                          disabled defaultValue={codigoText}/>
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="search-select-label-tipo-evento">Tipo Evento</InputLabel>
                            <Select
                              // Disables auto focus on MenuItems and allows TextField to be in focus
                              MenuProps={{ autoFocus: false }}
                              labelId="search-select-label-tipo-evento"
                              id="search-select-tipo-evento"
                              value={selectedEvento}
                              disabled={!editable}
                              label="Tipo de Evento"
                              onChange={(e) => setSelectedEvento(e.target.value)}
                              // This prevents rendering empty string in Select's value
                              // if search text would exclude currently selected option.

                            >
                              <ListSubheader>
                                <TextField
                                  size="small"
                                  autoFocus
                                  placeholder="Buscar tipo por nombre..."
                                  fullWidth
                                  value={searchTerm}
                                  onChange={changeTermSearch}
                                  onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <SearchIcon onClick={handleSearch} />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </ListSubheader>
                              {eventos.map((option, i) => (
                                <MenuItem key={i} value={option.id}>
                                  {option.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                    </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth  label="Descripción Completa" name="descripcion" 
                          multiline rows={3} disabled defaultValue={descripcionText}/>
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel 
                          id="search-select-label-ubicacion" >Ubicación</InputLabel>
                          <Select
                            // Disables auto focus on MenuItems and allows TextField to be in focus
                            MenuProps={{ autoFocus: false }}
                            labelId="search-select-label-ubicacion"
                            id="search-select-ubicacion"
                            value={selectedLugar}
                            disabled={!editable}
                            label="Elegir Ubicacion"
                            onChange={(e) => setSelectedLugar(e.target.value)}
                            // This prevents rendering empty string in Select's value
                            // if search text would exclude currently selected option.

                          >
                            <ListSubheader>
                              <TextField
                                size="small"
                                autoFocus
                                placeholder="Buscar lugar por nombre..."
                                fullWidth
                                value={searchLugar}
                                onChange={changeLugarSearch}
                                onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon onClick={handleLugarEvento} />
                                    </InputAdornment>
                                  )
                                }}
                              />
                            </ListSubheader>
                            {lugar.map((option, i) => (
                              <MenuItem key={i} value={option.id}>
                                {option.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth>
                            <InputLabel 
                            id="search-select-label-tienda" >Tienda</InputLabel>
                            <Select
                              // Disables auto focus on MenuItems and allows TextField to be in focus
                              MenuProps={{ autoFocus: false }}
                              labelId="search-select-label-tienda"
                              id="search-select-tienda"
                              value={selectedTienda}
                              disabled={!editable}
                              label="Elegir Tienda"
                              onChange={(e) => setSelectedTienda(e.target.value)}
                              // This prevents rendering empty string in Select's value
                              // if search text would exclude currently selected option.

                            >
                              <ListSubheader>
                                <TextField
                                  size="small"
                                  autoFocus
                                  placeholder="Buscar tienda por nombre..."
                                  fullWidth
                                  value={searchTienda}
                                  onChange={changeTiendaSearch}
                                  onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <SearchIcon onClick={handleTiendaEvento} />
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              </ListSubheader>
                              {tienda.map((option, i) => (
                                <MenuItem key={i} value={option.id}>
                                  {option.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="de">
                        <DatePicker
                          label="Fecha inicio"
                          value={startDate}
                          disabled={!editable}
                          format="DD/MM/YYYY"
                          sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                        />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={6}>
                        <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="de">
                        <DatePicker
                          label="Fecha fin"
                          value={endDate}
                          disabled={!editable}
                          format="DD/MM/YYYY"
                          sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                        />
                        </LocalizationProvider>
                      </Grid>
                      
                      </Grid>       
                      <Grid item xs={4}>
                        <TextField fullWidth label="Puntos Otorgados" name="puntosOtorgados" 
                          disabled defaultValue={puntosOtorgadosText}/>
                      </Grid>
                      <Grid item xs={11.5}>
                        <Box
                          sx={{
                            backgroundColor: '#f4f4f4',
                            padding: '16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <InfoIcon sx={{ marginRight: '8px', color: '#808080' }} />
                          <Typography variant="body1">Visualiza y descarga el QR para poder brindarle puntos a los clientes por participar en los eventos.</Typography>
                          
                        </Box>
                      </Grid>
                      <Grid item xs={0.5}>
                      <Button
                          variant="contained"
                          color="warning"
                          sx={{ 
                            backgroundColor: '#808080', // Color de fondo blanco
                            color: "#FFFFFF", // Color de texto azul
                            width: '40px', // Ajusta el ancho del botón para hacerlo circular
                            height: '40px', // Ajusta la altura del botón para hacerlo circular
                            borderRadius: '50%', // Hace que el borde sea redondo para formar un círculo

                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 0, // Elimina el relleno interno del botón
                            minWidth: 0,
                          }}
                          type='submit'
                          onClick={handleOpen}
                          >
                        <Iconify icon="ic:outline-remove-red-eye" sx={{ fontSize: '24px', margin: 'auto' }} />
                      </Button>
                      <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                          <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={{
                                  position: 'absolute',
                                  right: 8,
                                  top: 8,
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                              Código QR Generado
                            </Typography>
                            <Box id="modal-modal-description" sx={{ mt: 0 }}>
                              <img src={qrCode} alt="Código QR" style={{ width: '100%' }} />
                              <Button variant="contained" color="info" 
                              sx={{ marginRight: '8px' , backgroundColor: "#003B91", color:"#FFFFFF" ,width: '100%'}} 
                              onClick={handleDownload}
                              >
                                <Iconify icon="icon-park-outline:download" sx={{ fontSize: '24px', marginRight: '8px' }} />
                                Descargar
                              </Button>
                            </Box>
                          </Box>
                        </Modal>
                      </Grid>  
                    </Grid>
                  </Box>
                </Box>
              )}
            </form>

          ) : (
            <Box>
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
                  }}
                >
                  <CircularProgress color="primary" />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Cargando...
                  </Typography>
                </Box>
              ):(
              <Box>
                <Grid item xs={12} sx={{ paddingBottom: '2%', paddingTop:'0%', paddingRight: '0%'}}>
                    <Box display="flex" alignItems="center" sx={{ paddingLeft: '2%'}}>
                    <Typography variant="h3" component="div" sx={{ marginRight: 2 }}>
                        {nombreText}
                      </Typography>
                      <Chip
                        label={isActivo ? "Evento Activo" : "Evento Inactivo"}
                        color={isActivo ? "success" : "default"}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                </Grid>
                <Box  sx={{ borderRadius: '8px',  padding: '2%' , paddingTop: '0%' }}>
                  <Grid container spacing={2}  >
                    <Grid item xs={4} md={4} lg={4} container>
                      <Grid item xs={12} md={12} lg={12} >
                      <Card
                        sx={{
                          px: 3,
                          py: 5,
                          mx:2,
                          my:4,
                          border: "1px solid #BFC0C1",
                          backgroundColor: '#F9FAFB',
                          marginTop:'0%',
                          }} >
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <DashboardEventosAsistentes dataDash={dataDashEventos}/>
                            </Grid>
                          </Grid>
                      </Card>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} >
                        <Card
                          sx={{
                            px: 3,
                            py: 5,
                            mx:2,
                            my:4,
                            border: "1px solid #BFC0C1",
                            backgroundColor: '#F9FAFB',
                            marginTop:'0%',
                          }} >
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <DashboardAsistentes dataDash={dataDashEventos}/>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8}>
                      <Card


                        sx={{
                          px: 3,
                          py: 5,
                          mx:2,
                          my:4,
                          border: "1px solid #BFC0C1",
                          backgroundColor: '#F9FAFB',
                          marginTop:'0%',
                        }} >
                        <Grid container spacing={2}>

                          <Grid item xs={12}>
                          <DashboardGeneroEdad dataDash={dataDashEventosAgrupEdadAsist}/>
                          </Grid>

                        </Grid>

                      </Card>
                    </Grid>
                  </Grid>
                </Box >
              </Box >
              )}
            </Box >
          )}
        </Grid>
      </Grid>
    </Container>


  );
}
