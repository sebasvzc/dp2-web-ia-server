import dayjs from 'dayjs';
import * as React from 'react';
import utc from 'dayjs/plugin/utc';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Tab,
  Grid,
  Chip,
  Tabs,
  Table,
  Button,
  IconButton, 
  Modal,
  Select, MenuItem, TextField, TableBody, InputLabel,FormControl, createTheme , ThemeProvider, TableContainer
} from '@mui/material';  // Extiende dayjs con el plugin UTC


import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TablePagination from '@mui/material/TablePagination';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Iconify from '../../../components/iconify';
import UserTableToolbar from '../../user/user-table-toolbar';
import { getCategoriaTiendas } from '../../../funciones/api';
import TiendaClienteTableRow from "../tienda-cliente-table-row";
import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs';
import ClientCuponTableHead from '../../cupones/cupon-client.table.head';
import DashboardCuponesTiendaEspecifica from '../../overview/DashboardCuponesTiendaEspecifica';



dayjs.extend(utc);
dayjs.extend(customParseFormat);
export default function TiendaDetail() {
  const [view, setView] = useState('datos');
  const { id: idParam } = useParams();
  const [editable, setEditable] = useState(false);
  const [editableImg, setEditableImg] = useState(false);
  const [order, setOrder] = useState('asc');
  const [searchName, setSearchName] = useState("all");
  const [dataCupones, setDataCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habilitarCupones, setHabilitarCupones] = useState(true);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [activo,setActivo]=useState(false)
  const [orderBy, setOrderBy] = useState('id');
  const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
  const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const filterName= useState("")
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [dataDashCupones, setDataDashCupones] = useState({  fechas: [], cantidades: [] });
  const [totalCupones, setTotalCupones] = useState(10);
  const [tiendaText, setTiendaText] = useState('');
  const [esLimitadoText, setEsLimitadoText] = useState(false);
  const [esLimitadoDesp, setEsLimitadoDesp] = useState(false);
  const [sumillaText, setSumillaText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [terminosText, setTerminosText] = useState('');
  const [horaCierre, setHoraCierre] = useState(dayjs());
  const [horaApertura, setHoraApertura] = useState(dayjs());
  const [locacionText, setLocacionText] = useState('');
  const [startDateStat, setStartDateStat] = useState(dayjs().subtract(5, 'month').startOf('month'));
  const [endDateStat, setEndDateStat] = useState(dayjs().endOf('month'));
  const [aforo, setAforo] = useState('');
  const [fechaText, setFechaText] = useState('');
  const [costoText, setCostoText] = useState('');
  const [cantIniText, setCantIniText] = useState('');
  const [urlImagenS3 , setUrlImagenS3] = useState('');
  const [cantDisText, setCantDisText] = useState('');
  const [ordPriorizacionText, setOrdPriorizacionText] = useState('');
  const [files, setFiles] = React.useState([]);
  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  };
  const previewImage = document.querySelector("#previewImage");
  const [startDate, setStartDate] = useState(dayjs());
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoCupones, setTipoCupones] = useState([]);
  const [selectedTipoCupon, setSelectedTipoCupon] = useState('');
  const [searchTermTipoCupones, setSearchTermTipoCupones] = useState('');
  const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`;
  const navigate=useNavigate();

  useEffect(() => {
    // Suponiendo que tienes una función para cargar datos de un cupón por su id
    // eslint-disable-next-line no-shadow
    async function loadTiendaData(searchTerm,searchTermTipoCupones) {
      console.log("tiendaData")
      setLoading(true);
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        console.log(idParam)
        // Simulación de carga
        let response="";
        response = await fetch(`http://localhost:3000/api/tiendas/detalleTiendaCompleto`, {
          method: 'POST',
          body: JSON.stringify({ id:idParam }),
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

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        console.log(data)
        const resultsTipo =  await getCategoriaTiendas(token,refreshToken,data.detalles.categoriaTienda.nombre);
        console.log("viendo resultados categ tienda", resultsTipo)
        setCategorias(resultsTipo.cattiendas);

        if(data.detalles.activo===true){
          setActivo("Activo")
        }
        else{
          setActivo("Baneado")
        }
        console.log(esLimitadoText)
        setTiendaText(data.detalles.nombre)
        console.log("La categoria que no sale pipip:", data.detalles.categoriaTienda.id)
        setSelectedCategoria(data.detalles.categoriaTienda.id)
        setLocacionText(data.detalles.locacion)
        setUrlImagenS3(data.image)
        setDescripcionText(data.detalles.descripcion)
        console.log("hora apretura")
        console.log(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        console.log(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        setHoraApertura(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        setHoraCierre(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        setAforo(data.detalles.aforo)
        console.log(idParam)
        // Simulación de carga
        const endDateParam=`${endDateStat.date()}/${endDateStat.month()+1}/${endDateStat.year()}`;
        const startDateParam=`${startDateStat.date()}/${startDateStat.month()+1}/${startDateStat.year()}`;
        response = await fetch(`http://localhost:3000/api/tiendas/listarCuponesMesxTienda?idParam=${idParam}&endDate=${endDateParam}&startDate=${startDateParam}`, {
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
        console.log("Cupon detalle x cliente")
        const data5 = await response.json();
        console.log(data5)
        if(data5.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data5.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if (data5) {
          console.log("Viendo data5");
          console.log(data5);

          const fechasPorCategoria = data5.cupones.map(categoria => ({
            variable: categoria.variable,
            fechas: categoria.data.map(item => item.fechaMesAnio),
            cantidades: categoria.data.map(item => item.cantidad)
          }));

          console.log("Fechas y canjeados y usados:");
          console.log(fechasPorCategoria);

          // Aquí podrías usar `fechasPorCategoria` para actualizar el estado de tu componente
          // Por ejemplo:
          setDataDashCupones(fechasPorCategoria);

        }


        if(searchName===""){
          response = await fetch(`http://localhost:3000/api/tiendas/listarcuponesxtienda?query=all&idParam=${idParam}&page=${page}&pageSize=${pageSize}`, {
            method: 'GET',

            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            },

          });
        }else{
          response = await fetch(`http://localhost:3000/api/tiendas/listarcuponesxtienda?query=${searchName}&idParam=${idParam}&page=${page}&pageSize=${pageSize}`, {
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

        const dataCupon = await response.json();
        console.log("dataCupon de tablas")
        console.log(dataCupon)
        if(dataCupon.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = dataCupon.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el usuario en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if(dataCupon.totalCupones){
          setTotalCupones(dataCupon.totalCupones);
        }

        setDataCupones(dataCupon.cuponesXTienda);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoading(false);
      }
    }

    loadTiendaData();
  }, [endDateStat, esLimitadoText, idParam, page, pageSize, searchName, startDateStat]);


  // eslint-disable-next-line react/prop-types
  const InformativeBox = ({ text }) => (
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
      <Typography variant="body1">{text}</Typography>
    </Box>
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getCategoriaTiendas(token,refreshToken,searchTerm);
    console.log("viendo resultados categorias tiendas solo res", results)
    console.log("viendo resultados categorias tiendas", results.categorias)
    setCategorias(results.categorias);
  };
  const handleChangeImage = async (e) => {
    e.preventDefault();
    setEditableImg(true);
  };
  const changeTermSearch = async (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value)
  };

  const changeTermSearchTipoCupon = async (e) => {
    e.preventDefault();
    setSearchTermTipoCupones(e.target.value)
  };

  const handleLimitado = (event) => {
    setEsLimitadoDesp(event.target.value);
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
      const newSelecteds = dataCupones.map((n) => n.id);
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

  const [formDatos, setFormDatos] = useState({
    tipo: "tienda",  
    idReferencia: idParam,
  });
  
  const handleDescargarQR = async (event) => {
    event.preventDefault();
    try {
      const user = localStorage.getItem('user');
      const userStringify = JSON.parse(user);
      const { token, refreshToken } = userStringify;
      const formData = new FormData();
      console.log(idParam)
      formData.append("tipo", "tienda");
      formData.append("idReferencia", idParam)
      // Simulación de carga
      console.log(formDatos)
      let response="";
      response = await fetch(`http://localhost:3000/api/qr/generar`, {
        method: 'POST',
        body: JSON.stringify(formDatos),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },

      });
      const data = await response.json();
      console.log("Respuesta JSON: ", data.qrCode);
      descargarImagen(data.qrCode);
      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('user');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching crear QR:', error);
      throw error;
    }
  }

  const descargarImagen = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr_code.png'; // Puedes cambiar el nombre del archivo según sea necesario
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log("Valor de activo:", activo);
  const isActivo = activo === "Activo";

  const handleBack = () => {
    navigate('/tienda'); 
  }

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

  const [open, setOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const handleOpen = async (event) => {
    event.preventDefault();
    try {
      const user = localStorage.getItem('user');
      const userStringify = JSON.parse(user);
      const { token, refreshToken } = userStringify;
      const formData = new FormData();
      formData.append("tipo", "tienda");
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

  return (

    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <BasicBreadcrumbs />
      <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2}}>
          <ArrowBackIosIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2">Visualizar Tienda</Typography>
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
            <form encType="multipart/form-data">
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
                          {tiendaText}
                        </Typography>
                        <Chip
                          label={isActivo ? "Tienda Activa" : "Tienda Inactiva"}
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
                          <FormControl fullWidth>
                            <InputLabel id="search-select-label" disabled >Categoría</InputLabel>
                            <Select
                              // Disables auto focus on MenuItems and allows TextField to be in focus
                              MenuProps={{ autoFocus: false }}

                              labelId="search-select-label"
                              id="search-select"
                              disabled={!editable}
                              value={selectedCategoria}
                              label="Elegir Tienda"
                              name=""
                              onChange={(e) => setSelectedCategoria(e.target.value)}
                              // This prevents rendering empty string in Select's value
                              // if search text would exclude currently selected option.

                            >
                              <ListSubheader>
                                <TextField
                                  size="small"
                                  autoFocus
                                  placeholder="Busca una categoría por nombre..."
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
                              {categorias.map((option, i) => (
                                <MenuItem key={i} value={option.id}>
                                  {option.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Locacion" disabled name="locacion" defaultValue={locacionText}
                                    InputProps={{
                                      readOnly: true,
                                    }}/>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth label="Descripción" disabled name="descripcion" multiline rows={4}
                                    defaultValue={descripcionText} InputProps={{
                                      readOnly: true,
                                    }}/>
                        </Grid>
                        <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                            <TimePicker disabled
                              label="Hora Apertura"
                              value={horaApertura}
                              sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                            <TimePicker disabled
                              label="Hora Cierre"
                              value={horaCierre}
                              sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField fullWidth label="Aforo" disabled name="aforo" defaultValue={aforo}
                                    InputProps={{
                                      readOnly: true,
                                    }}/>
                        </Grid>
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
                          <Typography variant="body1">Visualiza y descarga el QR para poder brindarle puntos a los clientes por visitar tu tienda.</Typography>
                          
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
                        {tiendaText}
                      </Typography>
                      <Chip
                        label={isActivo ? "Tienda Activa" : "Tienda Inactiva"}
                        color={isActivo ? "success" : "default"}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                </Grid>
                <Box  sx={{ borderRadius: '8px',  padding: '2%' , paddingTop: '0%' }}>
                  <Grid container spacing={2} >
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={2}>
           
                            <DatePicker
                              label="Fecha inicial"
                              value={startDateStat}
                              onChange={setStartDateStat}
                              format="DD/MM/YYYY"
                              fullWidth
                              renderInput={(params) => <TextField {...params} />}
                              sx={{paddingRight:2}}
                            />
             
                            <DatePicker
                              label="Fecha final"
                              value={endDateStat}
                              onChange={setEndDateStat}
                              format="DD/MM/YYYY"
                              fullWidth
                              renderInput={(params) => <TextField {...params} />}
                            />
                  
                        </Grid>
                      </LocalizationProvider>
                    </Grid>
                    <Grid xs={12} md={12} lg={12}>
                    <Card
                          sx={{
                            px: 3,
                            py: 5,
                            mx:2,
                            my:4,
                            border: "1px solid #BFC0C1",
                            backgroundColor: '#F9FAFB',
                          }} >
                        <DashboardCuponesTiendaEspecifica dataDash={dataDashCupones}/>
                      </Card>
                    </Grid>
                    <Grid xs={12} sx={{ padding: '2%'  , paddingTop:0}}>
                    <Typography variant="h4" sx={{ paddingBottom: 0 }}>Cupones por tienda</Typography>
                      <Card>
                      <Stack direction="row" alignItems="center" sx={{height: 80, paddingBottom: 2}} justifyContent="space-between" mb={-3}>
                        <UserTableToolbar
                          numSelected={selected.length}
                          filterName={filterName}
                          onFilterName={handleSearch}
                        />
                      </Stack>
                        <TableContainer sx={{ overflow: 'unset' }}>
                          <Table sx={{ minWidth: 800 }}>
                            <ClientCuponTableHead
                              order={order}
                              orderBy={orderBy}
                              rowCount={dataCupones.length}
                              numSelected={selected.length}
                              onRequestSort={handleSort}
                              onSelectAllClick={handleSelectAllClick}
                              headLabel={[
                                { id: 'nombre', label: 'Codigo del Cupon' },
                                { id: 'fidCliente', label: 'Cliente' },
                                { id: 'usado', label: 'Usado' },
                                { id: 'fechaCompra', label: 'Fecha de Compra'}

                              ]}
                            />
                            <TableBody>
                              {dataCupones
                                .map((row) => (
                                  <TiendaClienteTableRow
                                    key={row.id}
                                    id={row.id}
                                    nombre={row.cupon.codigo}
                                    nombreCliente={`${row.cliente.nombre} ${row.cliente.apellidoPaterno}`} // Concatenación de cupon.codigo y cliente.nombre
                                    usado={row.usado}
                                    fechaCompra={row.fechaCompra}
                                    selected={selected.indexOf(row.id) !== -1}
                                    handleClick={(event) => handleClick(event, row.id)}
                                  />
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>


                        <TablePagination
                          page={page-1}
                          component="div"
                          count={totalCupones}
                          rowsPerPage={pageSize}
                          onPageChange={handleChangePage}
                          labelRowsPerPage="Cupones por página"
                          labelDisplayedRows={labelDisplayedRows}
                          rowsPerPageOptions={[6, 12, 18]}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              )}
            </Box >
          )}
        </Grid>
      </Grid>
    </Container>


  );
}