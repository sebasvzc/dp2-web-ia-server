import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import * as React from "react";
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
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
import {TimePicker,LocalizationProvider  } from '@mui/x-date-pickers';
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
  
  export default function TiendaNew() {
    const classes = useStyles();
    const navigate=useNavigate();

    const handleBack = () => {
      navigate('/tienda'); 
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

    const [backgroundBtnReg, setBackgroundBtnReg] = useState("#CCCCCC");
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

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
        formData.append("nombre", event.target.nombre.value);
        formData.append("descripcion", event.target.descripcion.value);
        formData.append("locacion", event.target.locacion.value);
        const horaApertura = startTime.format("HH:mm:ss");
        const horaCierre = endTime.format("HH:mm:ss");
        formData.append("horaApertura", horaApertura);
        formData.append("horaCierre", horaCierre);
        formData.append("aforo", event.target.aforo.value);
        formData.append("fidCategoriaTienda", selectedTienda);
        console.log(formData.append)
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        
        let response="";
        console.log("Respuesta", response);
        response = await fetch(`http://localhost:3000/api/tiendas/crear`, {
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
        toast.success('Tienda creada exitosamente', {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        navigate('/tienda');
        return data;
      } catch (error) {
        console.error('Error fetching crear tiendas:', error);
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
    const [tiendas, setTiendas] = useState([]);
    const [selectedTienda, setSelectedTienda] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoTiendaes, setTipoTiendaes] = useState([]);
    const [selectedTipoTienda, setSelectedTipoTienda] = useState('');
    const [searchTermTipoTiendaes, setSearchTermTipoTiendaes] = useState('');



    const getCategoriaTiendas = async () => {
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        console.log(searchTerm)
        if(searchTerm===""){
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
        console.error('Error fetching cupones:', error);
        throw error;
      }
    };

    
    const getTipoTiendaes = async () => {
      /*
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        console.log(searchTermTipoTiendaes)
        if(searchTerm===""){
          response = await fetch(`http://localhost:3000/api/tipocupones/listartipocupones?query=all&page=1&pageSize=10`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            }
          });
        }else{
          response = await fetch(`http://localhost:3000/api/tipocupones/listartipocupones?query=${searchTerm}&page=1&pageSize=10`, {
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
      */
    };
  
    
    const handleSearch = async (e) => {
      e.preventDefault();
      const results = await getCategoriaTiendas();
      console.log("viendo resultados", results)
      setTiendas(results.cattiendas);
    };
    
    const changeTermSearch = async (e) => {
      e.preventDefault();
      setSearchTerm(e.target.value)
    };
    
    const handleSearchTipoTienda = async (e) => {
      e.preventDefault();
      const results = await getTipoTiendaes();
      console.log("viendo resultados", results.tipoTiendaes)
      setTipoTiendaes(results.tipoTiendaes);
    };
    const changeTermSearchTipoTienda = async (e) => {
      e.preventDefault();
      setSearchTermTipoTiendaes(e.target.value)
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

    const [mostrarTxtNombre, setMostrarTxtNombre] = useState('');
    const [mostrarTxtDescripcion, setMostrarTxtDescripcion] = useState('');
    const [mostrarTxtLocacion, setMostrarTxtLocacion] = useState('');
    const [mostrarTxtAforo, setMostrarTxtAforo] = useState('');
    const [mostrarTxtApertura, setMostrarTxtApertura] = useState('');
    const [mostrarTxtCierre, setMostrarTxtCierre] = useState('');


    useEffect(() => {
      const horaApertura = startTime.format("HH:mm:ss");
      const horaCierre = endTime.format("HH:mm:ss");
      const horaAperturaDate = new Date(`1970-01-01T${  horaApertura}`);
      const horaCierreDate = new Date(`1970-01-01T${  horaCierre}`);
      if (formDatos.nombre.length !== 0
        && selectedTienda.length !== 0
        && formDatos.aforo.length !== 0
        && formDatos.descripcion.length !== 0
        && formDatos.locacion.length !== 0
        && startTime.length !== 0
        && endTime.length !== 0
        && files.length !== 0
        && horaAperturaDate < horaCierreDate
      ) {
        setBackgroundBtnReg("#003B91");
        setBotonDeshabilitado(false);
      } else {
        setBackgroundBtnReg("#CCCCCC");
        setBotonDeshabilitado(true);
      }
      
      console.log(horaAperturaDate);
      console.log(horaCierreDate);

    if (horaAperturaDate > horaCierreDate) {
      setMostrarTxtApertura('La hora de apertura es mayor que la hora de cierre.');
    }else {
      setMostrarTxtApertura("");
    }
  
    },[formDatos.nombre,selectedTienda,formDatos.aforo,
      formDatos.descripcion, formDatos.locacion,startTime,endTime,files]); // Cierra correctamente con un corchete    
  

    return (
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
       <BasicBreadcrumbs />
       <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
          <ArrowBackIosIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2" >Crear Tienda</Typography>
        </Stack>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Box sx={{ mt: 3 , borderRadius: '8px',  padding: '2%' , border: '2px solid #CCCCCC', backgroundColor: '#F5F5F5' }}>
        <p>
            <strong>(*) Todos los campos son obligatorios para poder crear una tienda</strong>
          </p>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
            <Grid item xs={12} >
                    <Dropzone onChange={updateFiles} value={files} label="Arrastra y suelta tus archivos" 
                    maxFiles={1} footer={false} localization="ES-es" accept="image/*"
                    >
                      {files.map((file) => (
                        <FileMosaic {...file} preview   localization="ES-es" style={{width: '70%'}}/>
                      ))}
                    </Dropzone>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth 
                onChange={handleChange}
                label="Nombre" name="nombre" />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel 
                  id="search-select-label" >Categoría</InputLabel>
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
                    value={selectedTienda}
                    label="Elegir Categoría"
                    onChange={(e) => setSelectedTienda(e.target.value)}
                    // This prevents rendering empty string in Select's value
                    // if search text would exclude currently selected option.

                  >
                    <ListSubheader>
                      <TextField
                        size="small"
                        autoFocus
                        placeholder="Busca categoría por nombre..."
                        fullWidth
                        value={searchTerm}
                        onChange={changeTermSearch}
                        onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon onClick={handleSearch} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </ListSubheader>
                    {tiendas.map((option, i) => (
                      <MenuItem key={i} value={option.id}>
                        {option.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth 
                onChange={handleChange}
                label="Locacion" name="locacion" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth 
                onChange={handleChange}
                label="Descripción" name="descripcion" />
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                  <TimePicker
                    label="Hora Apertura"
                    value={startTime}
                    onChange={setStartTime}
                    sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                />
                </LocalizationProvider>
                <input className="inputEspecialAC" type="text" value={mostrarTxtApertura} onChange={handleChange} 
                style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'transparent',outline: 'none'}}
                disabled/>
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                  <TimePicker
                    label="Hora Cierre"
                    value={endTime}
                    onChange={setEndTime}
                    sx={{ width: '100%', marginBottom: 0, paddingBottom: 0 }}
                />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth 
                onChange={handleChange}
                label="Aforo" name="aforo" />
              </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="info" 
            sx={{backgroundColor: backgroundBtnReg, color:"#FFFFFF" , fontSize: '1rem',marginTop: '16px', marginBottom: '0px'}}
            type='submit'
            disabled={botonDeshabilitado}>Crear</Button>
            </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    );

  }