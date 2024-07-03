import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import * as React from "react";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Dropzone, FileMosaic } from "@files-ui/react";

import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import SearchIcon from "@mui/icons-material/Search";
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider  } from '@mui/x-date-pickers';
import {Box, Grid, Button, Select, MenuItem, TextField, Container, Typography, InputLabel, FormControl } from '@mui/material';

import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs';

dayjs.locale('es-mx');

const useStyles = makeStyles((theme) => ({
  hideNavigationButton: {
    display: 'none !important',
  },
  paginationContainer: {
    display: 'inline-block',
  },
  centeredPagination: {
    margin: 'auto',
    maxWidth: 'fit-content',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    cursor: 'pointer',
  },
  deleteIcon: {
    color: 'white',
  },
  fileUpload:{
    alignItems: 'center',
  }
}));
  // ----------------------------------------------------------------------
  const scrollContainerStyle = {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 470px)',
    paddingRight: '0.1%',
    boxSizing: 'border-box', // Añade esta propiedad para incluir el padding en el ancho total
  };
  const fileTypes = ["JPG", "PNG"];
  
  export default function EventoNew() {
    const classes = useStyles();
    const navigate=useNavigate();

    const handleBack = () => {
      navigate('/evento'); 
    }
    /* const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('/public/a/tu/imagen.jpg');
    const [showFileUploader, setShowFileUploader] = useState(true);

    const handleChange = (fileX) => {
      setFile(fileX);
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };

      reader.readAsDataURL(fileX);
      setShowFileUploader(false);
    };

    const handleImageClick = () => {
      setShowFileUploader(true);
    };

    const handleDeleteImage = () => {
      setFile(null);
      setImagePreview(null);
      setShowFileUploader(true);
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      // Lógica para manejar la submisión del formulario
    }; */
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [backgroundBtnReg, setBackgroundBtnReg] = useState("#003B91");
    const [editable, setEditable] = useState(false);
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
    const [loading2,setLoading2]=useState(false);

    const handleSubmit = async (event) => {
      console.log("EntrandoSubmit")
      event.preventDefault();
      try {
        console.log("1")
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const formData = new FormData();

        formData.append("file", files[0].file)
        formData.append("codigo", event.target.codigo.value);
        formData.append("nombre", event.target.nombre.value);
        formData.append("descripcion", event.target.descripcion.value);
        formData.append("fechaInicio", startDate.format("YYYY-MM-DD"));  // Asegúrate de que startDate es manejado correctamente
        formData.append("fechaFin", endDate.format("YYYY-MM-DD"));  // Asegúrate de que startDate es manejado correctamente
        formData.append("puntosOtorgados", event.target.puntosOtorgados.value);
        formData.append("fidTienda", selectedTienda);
        formData.append("fidLugar", selectedLugar);
        formData.append("fidTipoEvento", selectedEvento);

        console.log(formData.append)
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        
        let response="";
        console.log("Respuesta", response);
        response = await fetch(`http://localhost:3000/api/eventos/crear`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });
        console.log("Respuesta", response);
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        toast.success('Evento creada exitosamente', {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        navigate('/evento');
        return data;
      } catch (error) {
        console.error('Error fetching crear eventos:', error);
        throw error;
      }
    };
    const [files, setFiles] = React.useState([]);
    const updateFiles = (incommingFiles) => {
      console.log(typeof incommingFiles)
      setFiles(incommingFiles);
    };
    const [startTime, setStartTime] = useState(dayjs());
    const [endTime, setEndTime] = useState(dayjs());
    const [eventos, setEventos] = useState([]);
    const [lugar, setLugar] = useState([]);
    const [tienda, setTienda] = useState([]);
    const [selectedEvento, setSelectedEvento] = useState('');
    const [selectedLugar, setSelectedLugar] = useState('');
    const [selectedTienda, setSelectedTienda] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLugar, setSearchLugar] = useState('');
    const [searchTienda, setSearchTienda] = useState('');

    const getTipoEventos = async () => {

      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        if(searchTerm===""){
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

    const getLugarEvento = async () => {
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        if(searchLugar===""){
          response = await fetch(`http://localhost:3000/api/lugares/listarLugares?query=all&page=1&pageSize=10`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            }
          });
        }else{
          response = await fetch(`http://localhost:3000/api/lugares/listarLugares?query=${searchLugar}&page=1&pageSize=10`, {
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

    const getTiendaEvento = async () => {
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        if(searchTienda===""){
          response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=all&page=1&pageSize=300`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            }
          });
        }else{
          response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=${searchTienda}&page=1&pageSize=300`, {
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
  
    const handleCrear = () => {
      navigate('/evento'); // Redirige al usuario a la ruta especificada
    };
    
    const handleSearch = async (e) => {
      e.preventDefault();
      const results = await getTipoEventos();
      console.log("viendo resultados", results.tipoEventos)
      setEventos(results.tipoEventos);
    };
    
    const changeTermSearch = async (e) => {
      e.preventDefault();
      setSearchTerm(e.target.value)
    };

    const changeLugarSearch = async (e) => {
      e.preventDefault();
      setSearchLugar(e.target.value)
    };
    
    const handleLugarEvento = async (e) => {
      e.preventDefault();
      const results = await getLugarEvento();
      console.log("viendo resultados", results.lugares)
      setLugar(results.lugares);
    };

    const changeTiendaSearch = async (e) => {
      e.preventDefault();
      setSearchTienda(e.target.value)
    };
    
    const handleTiendaEvento = async (e) => {
      e.preventDefault();
      const results = await getTiendaEvento();
      setTienda(results.tiendas);
    };

    const [formDatos, setFormDatos] = useState({
      nombre: '',  
      descripcion: '',
      locacion: '',
      aforo: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormDatos((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

/*
    useEffect(() => {
      const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
      const isNonZeroNumber = (value) => typeof value === 'number' && value !== 0;
      const isNonEmptyArray = (value) => Array.isArray(value) && value.length > 0;
    
      if (
        isNonEmptyString(formDatos.nombre) &&
        isNonEmptyString(formDatos.codigo) &&
        isNonEmptyString(formDatos.descripcion) &&
        isNonEmptyArray(selectedEvento) &&
        isNonEmptyArray(selectedLugar) &&
        isNonEmptyArray(selectedTienda) &&
        isNonZeroNumber(formDatos.puntosOtorgados) &&
        startDate && endDate && (new Date(startDate) < new Date(endDate)) &&
        isNonEmptyArray(files)
      ) {
        setBackgroundBtnReg("#003B91");
        setBotonDeshabilitado(false);
      } else {
        setBackgroundBtnReg("#CCCCCC");
        setBotonDeshabilitado(true);
      }
    }, [
      formDatos.nombre, formDatos.codigo, selectedEvento, selectedTienda, selectedLugar,
      formDatos.descripcion, startDate, endDate, files,
      formDatos.puntosOtorgados, formDatos.edadPromedio, formDatos.generoPromedio,
      formDatos.ordenPriorizacion
    ]);
    */
    return (
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
      <BasicBreadcrumbs />
       <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
          <ArrowBackIosIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2">Crear Evento</Typography>
        </Stack>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Box sx={{ mt: 3 , borderRadius: '8px',  padding: '2%' , border: '2px solid #CCCCCC', backgroundColor: '#F5F5F5' }}>
        <p>
            <strong>(*) Todos los campos son obligatorios para poder crear una evento</strong>
          </p>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={3} >
                    <Dropzone onChange={updateFiles} value={files} label="Arrastra una imagen" 
                    maxFiles={1} footer={false} localization="ES-es" accept="image/*"
                    >
                      {files.map((file) => (
                        <FileMosaic {...file} preview   localization="ES-es" style={{width: '50%'}}/>
                      ))}
                    </Dropzone>
              </Grid>
              <Grid item xs={9} container spacing={2}>
                <Grid item xs={4}>
                  <TextField fullWidth 
                  onChange={handleChange}
                  label="Código" name="codigo" />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth 
                  onChange={handleChange}
                  label="Nombre" name="nombre" />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                          <InputLabel id="search-select-label-tipo-evento">Tipo Evento</InputLabel>
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
                            labelId="search-select-label-tipo-evento"
                            id="search-select-tipo-evento"
                            value={selectedEvento}
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
                  <TextField fullWidth onChange={handleChange}  label="Descripción Completa" name="descripcion" multiline rows={3} />
                </Grid>
              </Grid>       
              <Grid item xs={3}>
                <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="de">
                <DatePicker
                  label="Fecha inicio"
                  value={startDate}
                  format="DD/MM/YYYY"
                  onChange={setStartDate}
                  sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3}>
                <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="de">
                <DatePicker
                  label="Fecha fin"
                  value={endDate}
                  format="DD/MM/YYYY"
                  onChange={setEndDate}
                  sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel 
                  id="search-select-label-ubicacion" >Ubicación</InputLabel>
                  <Select
                    // Disables auto focus on MenuItems and allows TextField to be in focus
                    MenuProps={{ autoFocus: false }}
                    labelId="search-select-label-ubicacion"
                    id="search-select-ubicacion"
                    value={selectedLugar}
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
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel 
                  id="search-select-label-tienda" >Tienda</InputLabel>
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
                    labelId="search-select-label-tienda"
                    id="search-select-tienda"
                    value={selectedTienda}
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
              <Grid item xs={3}>
                <TextField fullWidth 
                onChange={handleChange}
                label="Puntos Otorgados" name="puntosOtorgados" />
              </Grid>
              { /* <Grid item xs={3}>
                <TextField fullWidth 
                onChange={handleChange}
                label="Edad Promedio" name="edadPromedio" />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth 
                onChange={handleChange}
                label="Género Promedio" name="generoPromedio" />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth 
                onChange={handleChange}
                label="Orden Priorización" name="ordenPriorizacion" />
              </Grid> */ }
            </Grid>
            <Grid item xs={12}> 
            <Button variant="contained" color="info" 
            sx={{backgroundColor: backgroundBtnReg, color:"#FFFFFF" , fontSize: '1rem',marginTop: '16px', marginBottom: '0px'}}
            type='submit' disabled={botonDeshabilitado}
              >Crear</Button>
            </Grid>
          </form>
        </Box>
      </Container>
    );

  }