import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as React from 'react';
import utc from 'dayjs/plugin/utc';
import { useState, useEffect } from 'react';
import { Dropzone, FileMosaic } from '@files-ui/react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import {
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel, FormControl,
} from '@mui/material';  // Extiende dayjs con el plugin UTC
import { toast } from 'react-toastify';  // Importa el plugin UTC para manejar correctamente las fechas UTC
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import TablePagination from '@mui/material/TablePagination';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Stack from '@mui/material/Stack';
import { MarginOutlined } from '@mui/icons-material';
import Iconify from '../../../components/iconify';
import UserTableToolbar from '../../user/user-table-toolbar';
import { getCategoriaTiendas } from '../../../funciones/api';
import DashboardCuponClient from '../../overview/dashboardCuponClient';
import FictionBooksSalesChart from '../../overview/FictionBooksSalesChart';
import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs';


dayjs.extend(utc);
dayjs.extend(customParseFormat);
export default function TiendaDetail() {
  const [view, setView] = useState('datos');
  const { id: idParam } = useParams();
  const [editable, setEditable] = useState(false);
  const [editableImg, setEditableImg] = useState(false);
  const [order, setOrder] = useState('asc');
  const [searchName, setSearchName] = useState("all");
  const [dataClients, setDataClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habilitarCupones, setHabilitarCupones] = useState(true);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading2,setLoading2]=useState(false);
  const [orderBy, setOrderBy] = useState('id');
  const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
  const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const filterName= useState("")
  const [dataDash, setDataDash] = useState({ fechas: [], cantidades: [] });
  const [totalClientsCupon, setTotalClientsCupon] = useState(10);
  const [tiendaText, setTiendaText] = useState('');
  const [esLimitadoText, setEsLimitadoText] = useState(false);
  const [esLimitadoDesp, setEsLimitadoDesp] = useState(false);
  const [sumillaText, setSumillaText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [terminosText, setTerminosText] = useState('');
  const [horaCierre, setHoraCierre] = useState(dayjs());
  const [horaApertura, setHoraApertura] = useState(dayjs());
  const [locacionText, setLocacionText] = useState('');
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

  const handleBack = () => {
    navigate('/tienda'); 
  }

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


        const resultsTipo =  await getCategoriaTiendas(token,refreshToken,searchTermTipoCupones);
        console.log("viendo resultados categ tienda", resultsTipo)
        setCategorias(resultsTipo.cattiendas);

        const data = await response.json();
        console.log(data)


        console.log(esLimitadoText)
        setTiendaText(data.detalles.nombre)
        console.log("La categoria que no sale pipip:", data.detalles.categoriaTienda.id)
        setSelectedCategoria(data.detalles.categoriaTienda.id)
        setLocacionText(data.detalles.locacion)
        setDescripcionText(data.detalles.descripcion)
        console.log("hora apretura")
        console.log(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        console.log(dayjs(data.detalles.horaCierre, 'HH:mm:ss'))
        setHoraApertura(dayjs(data.detalles.horaApertura, 'HH:mm:ss'))
        setHoraCierre(dayjs(data.detalles.horaCierre, 'HH:mm:ss'))
        setAforo(data.detalles.aforo)
        setUrlImagenS3(data.image);
        console.log(idParam)
        // Simulación de carga

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cupon data", err);

        setLoading(false);
      }
    }

    loadTiendaData();
  }, [esLimitadoText, idParam, page, pageSize, searchName]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('HOLA')
    console.log(event)
    try {
      const user = localStorage.getItem('user');
      const userStringify = JSON.parse(user);
      const { token, refreshToken } = userStringify;
      const formData = new FormData();
      if (files && files.length > 0) {
        formData.append("file", files[0].file);
      } else {
        console.log("No se ha enviado ningún archivo");
        // Manejar el caso donde no se ha enviado ningún archivo si es necesario
      }

      formData.append("id", idParam);
      // formData.append("file", files[0].file)
      formData.append("nombre", event.target.nombre.value);
      formData.append("descripcion", event.target.descripcion.value);
      formData.append("locacion", event.target.locacion.value);
      formData.append("horaApertura", horaApertura.format('HH:mm:ss'));
      formData.append("horaCierre", horaCierre.format('HH:mm:ss'));
      formData.append("aforo", event.target.aforo.value);
      formData.append("fidCategoriaTienda", selectedCategoria);
      // eslint-disable-next-line no-restricted-syntax
      console.log('ESTE ES EL MODIFICAR TIENDA')
      console.log(formData)


      let response="";
      response = await fetch(`http://localhost:3000/api/tiendas/modificar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'multipart/form-data',
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
      toast.success('Tienda modificada exitosamente', {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
      setEditable(false);
      return data;
    } catch (error) {
      console.error('Error fetching crear cupones:', error);
      throw error;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const { token, refreshToken } = userStringify;
    const results = await getCategoriaTiendas(token,refreshToken,searchTerm);
    console.log("viendo resultados categorias tiendas solo res", results)
    console.log("viendo resultados categorias tiendas", results.cattiendas)
    setCategorias(results.cattiendas);
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

  return (
    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <BasicBreadcrumbs />
      <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
          <ArrowBackIosIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" >Modificar Tienda</Typography>
      </Stack>
      
      <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
      <Grid container  >

        <Grid item >
          {view === 'datos' ? (
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ paddingRight: '2%'}}>
                {!editable && (
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: 5,
                      backgroundColor: "#003B91"
                    }} // Añade un margen derecho para separar botones si es necesario
                    startIcon={<Iconify icon="ic:baseline-edit" />}
                    onClick={() => setEditable(true)}
                  >
                    Editar
                  </Button>
                )}
                {editable && ( // Renderiza estos botones solo si 'editable' es true
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      sx={{ marginTop: 5, marginRight:2, backgroundColor: "#198754" }}
                      startIcon={<Iconify icon="ic:baseline-save" /> }
                      disabled={loading2}
                    >
                      Guardar
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Iconify icon="ic:baseline-cancel" />}
                      sx={{ marginTop: 5, backgroundColor: "#DC3545" }}
                      onClick={() => {
                        setEditable(false);
                        setEditableImg(false); // Cambia 'editableImg' a false para "cancelar" adicionalmente
                      }} // Opcional: Cambia 'editable' a false para "cancelar"
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </Box>
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
                <Box sx={{ mt: 3, maxHeight: '60vh', pr: 2 ,  padding: '2%'}}>

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
                        <TextField fullWidth label="Nombre" name="nombre" defaultValue={tiendaText} disabled={!editable} />
                      </Grid>

                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel id="search-select-label" disabled >Categoría</InputLabel>
                          <Select
                            // Disables auto focus on MenuItems and allows TextField to be in focus
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300, // Ajusta la altura máxima del menú desplegable aquí
                                  width: 250, // Ajusta el ancho del menú desplegable si es necesario
                                },
                              },
                            }}
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
                        <TextField fullWidth label="Locacion" name="locacion" defaultValue={locacionText}
                                  disabled={!editable} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Aforo" name="aforo" defaultValue={aforo}
                                  disabled={!editable} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Descripción" name="descripcion" multiline rows={4}
                                  defaultValue={descripcionText} disabled={!editable} />
                      </Grid>
                      <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                          <TimePicker disabled={!editable}
                            label="Hora Apertura"
                            value={horaApertura}
                            onChange={(newValue) => setHoraApertura(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                          <TimePicker disabled={!editable}
                            label="Hora Cierre"
                            value={horaCierre}
                            onChange={(newValue) => setHoraCierre(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                          />
                        </LocalizationProvider>
                      </Grid>

                      
                    </Grid>
                  </Grid>
                </Box>
              )}
            </form>

          ) : (
            <Box sx={{paddingTop:10}}>
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
              <Grid container spacing={2}  >
              <Grid xs={12} >
                  <FictionBooksSalesChart/>
              </Grid>
              </Grid>
              )}
              </Box >
          )}
        </Grid>
      </Grid>
    </Container>


  );
}