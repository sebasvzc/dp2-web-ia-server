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
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Grid,
  Button,
  Select,
  MenuItem,
  TextField, InputLabel, FormControl,
} from '@mui/material';  // Extiende dayjs con el plugin UTC
import { toast } from 'react-toastify';  // Importa el plugin UTC para manejar correctamente las fechas UTC

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Iconify from '../../../components/iconify';
import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs';
import { getTipoEventos,getLugarEvento,getTiendaEvento, } from '../../../funciones/api';

dayjs.extend(utc);

export default function EventoEdit() {
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

  const [codigoText, setCodigoText] = useState('');
  const [nombreText, setNombreText] = useState('');
  const [descripcionText, setDescripcionText] = useState('');
  const [puntosOtorgadosText, setPuntosOtorgadosText] = useState('');
  const [selectedLugar, setSelectedLugar] = useState('');
  const [selectedEvento, setSelectedEvento] = useState('');
  const [loading2,setLoading2]=useState(false);
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
        setFiles(data.image);
        console.log("Datos de data:", data.detalles)
        setSelectedEvento(data.detalles.tipoEvento.id)
        setSelectedLugar(data.detalles.lugar.id)
        setSelectedTienda(data.detalles.locatario.id)

        console.log(idParam)
        setLoading(false);
      }catch (err) {
        console.error("Failed to fetch cupon data", err);
      }
    }
      loadEventoData();
  }, [idParam, navigate, page, pageSize, searchName]);


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
      formData.append("codigo", event.target.codigo.value);
      formData.append("nombre", event.target.nombre.value);
      formData.append("descripcion", event.target.descripcion.value);
      formData.append("fechaInicio", startDate.format("YYYY-MM-DD"));  // Asegúrate de que startDate es manejado correctamente
      formData.append("fechaFin", endDate.format("YYYY-MM-DD"));  // Asegúrate de que startDate es manejado correctamente
      formData.append("puntosOtorgados", event.target.puntosOtorgados.value);
      formData.append("fidTienda", selectedTienda);
      formData.append("fidLugar", selectedLugar);
      formData.append("fidTipoEvento", selectedEvento);
      console.log(formData)


      let response="";
      response = await fetch(`http://localhost:3000/api/eventos/modificar`, {
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
      toast.success('Evento modificado exitosamente', {
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

  return (
    <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }}>
      <BasicBreadcrumbs />
      <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
          <ArrowBackIosIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2">Modificar Evento</Typography>
      </Stack>
      <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
      <Grid container >
       
        <Grid item >
          {view === 'datos' ? (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <Grid item xs={2}>
                        <TextField fullWidth label="Código" name="codigo" 
                        disabled defaultValue={codigoText}/>
                      </Grid>
                      <Grid item xs={5}>
                        <TextField fullWidth label="Nombre" name="nombre" 
                        disabled={!editable} defaultValue={nombreText}/>
                      </Grid>
                      <Grid item xs={5}>
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
                        multiline rows={3} disabled={!editable} defaultValue={descripcionText}/>
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
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
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
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        format="DD/MM/YYYY"
                        sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                      />
                      </LocalizationProvider>
                    </Grid>
                    
                    </Grid>       
                    <Grid item xs={4}>
                      <TextField fullWidth label="Puntos Otorgados" name="puntosOtorgados" 
                        disabled={!editable} defaultValue={puntosOtorgadosText}/>
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
                <Grid container spacing={2} />

              )}
              </Box >
          )}
        </Grid>
      </Grid>
    </Container>


  );
}
