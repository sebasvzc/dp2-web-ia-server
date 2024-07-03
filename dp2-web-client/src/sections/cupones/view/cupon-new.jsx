import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import * as React from "react";
import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
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
import { DatePicker,LocalizationProvider  } from '@mui/x-date-pickers';
import {Box, Grid, Button, Select, MenuItem, TextField, Container, Typography, InputLabel, FormControl } from '@mui/material';
import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs'; // Ruta corregida

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
  export default function CuponNew() {
    const classes = useStyles();
    const navigate=useNavigate();

    const handleBack = () => {
      navigate('/cupon'); 
    }
    /* const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('/public/a/tu/imagen.jpg');
    const [showFileUploader, setShowFileUploader] = useState(true);

    
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
    const [loading2,setLoading2]=useState(false);


    const handleCrear = () => {
      
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        const formData = new FormData();
        
        formData.append("file", files[0].file)
        formData.append("esLimitado", esLimitado);
        formData.append("codigo", event.target.codigo.value);
        formData.append("sumilla", event.target.sumilla.value);
        formData.append("descripcionCompleta", event.target.descripcionCompleta.value);
        formData.append("terminosCondiciones", event.target.terminosCondiciones.value);
        formData.append("fechaExpiracion", startDate.format("YYYY-MM-DD"));  // Asegúrate de que startDate es manejado correctamente
        formData.append("costoPuntos", event.target.costoPuntos.value);
        formData.append("cantidadInicial", event.target.cantidadInicial.value);
        formData.append("ordenPriorizacion", event.target.ordenPriorizacion.value);
        formData.append("fidLocatario", selectedTienda);
        formData.append("fidTipoCupon", selectedTipoCupon);
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        formData.append("permission","Gestion de Cupones");
         let response="";

         setLoading2(true)
        response = await fetch(`http://localhost:3000/api/cupones/crear`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },

        });

        setLoading2(false)
        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem('user');
          window.location.reload();
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        toast.success('Cupon creado exitosamente', {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        navigate('/cupon');
        return data;
      } catch (error) {
        setLoading2(false)
        console.error('Error fetching crear cupones:', error);
        throw error;
      }
    };
    const [files, setFiles] = React.useState([]);
    const updateFiles = (incommingFiles) => {
      console.log(typeof incommingFiles)
      setFiles(incommingFiles);
    };
    const [esLimitado, setEsLimitado] = useState('');

    const handleLimitado = (event) => {
      setEsLimitado(event.target.value);
    };
    const [startDate, setStartDate] = useState(dayjs());
    const [tiendas, setTiendas] = useState([]);
    const [selectedTienda, setSelectedTienda] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoCupones, setTipoCupones] = useState([]);
    const [selectedTipoCupon, setSelectedTipoCupon] = useState('');
    const [searchTermTipoCupones, setSearchTermTipoCupones] = useState('');
    const getTiendas = async () => {
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        console.log(searchTerm)
        if(searchTerm===""){
          response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=all&page=1&pageSize=300`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Refresh-Token': `Bearer ${refreshToken}`
            }
          });
        }else{
          response = await fetch(`http://localhost:3000/api/tiendas/listartiendas?query=${searchTerm}&page=1&pageSize=300`, {
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

    const getTipoCupones = async () => {
      try {
        const user = localStorage.getItem('user');
        const userStringify = JSON.parse(user);
        const { token, refreshToken } = userStringify;
        let response="";
        console.log(searchTermTipoCupones)
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
    };
    const handleSearch = async (e) => {
      e.preventDefault();
      const results = await getTiendas();
      console.log("viendo resultados", results.tiendas)
      setTiendas(results.tiendas);
    };
    const changeTermSearch = async (e) => {
      e.preventDefault();
      setSearchTerm(e.target.value)
    };
    const handleSearchTipoCupon = async (e) => {
      e.preventDefault();
      const results = await getTipoCupones();
      console.log("viendo resultados", results.tipoCupones)
      setTipoCupones(results.tipoCupones);
    };
    const changeTermSearchTipoCupon = async (e) => {
      e.preventDefault();
      setSearchTermTipoCupones(e.target.value)
    };
    console.log(startDate)

    const [formDatos, setFormDatos] = useState({
      codigo: '',  
      sumilla: '',
      descripcionCompleta: '',
      terminosCondiciones: '',
      costoPuntos: '',
      cantidadInicial: '',
      ordenPriorizacion: '',
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormDatos((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const [mostrarTxtFile, setMostrarTxtFile] = useState("");
    const [mostrarTxtEsLimitado, setMostrarTxtEsLimitado] = useState("");
    const [mostrarTxtCodigo, setMostrarTxtCodigo] = useState("");
    const [mostrarTxtSumilla, setMostrarTxtSumilla] = useState("");
    const [mostrarTxtDescripcionCompleta, setMostrarTxtDescripcionCompleta] = useState("");
    const [mostrarTxtTerminosCondiciones, setMostrarTxtTerminosCondiciones] = useState("");
    const [mostrarTxtFechaExpiracion, setMostrarTxtFechaExpiracion] = useState("");
    const [mostrarTxtCostoPuntos, setMostrarTxtCostoPuntos] = useState("");
    const [mostrarTxtCantidadInicial, setMostrarTxtCantidadInicial] = useState("");
    const [mostrarTxtOrdenPriorizacion, setMostrarTxtOrdenPriorizacion] = useState("");
    const [mostrarTxtFidLocatario, setMostrarTxtFidLocatario] = useState("");
    const [mostrarTxtFidTipoCupon, setMostrarTxtFidTipoCupon] = useState("");

  useEffect(() => {
    console.log(selectedTienda)
    if (formDatos.codigo.length !== 0
      && selectedTienda.length !== 0
      && selectedTipoCupon.length !== 0
      && formDatos.sumilla.length !== 0
      && formDatos.descripcionCompleta.length !== 0
      && formDatos.terminosCondiciones.length !== 0
      && formDatos.costoPuntos.length !== 0
      && formDatos.cantidadInicial.length !== 0
      && formDatos.ordenPriorizacion.length !== 0
      && startDate.length !== 0
      && files.length !== 0
    ) {
      setBackgroundBtnReg("#003B91");
      setBotonDeshabilitado(false);
    } else {
      setBackgroundBtnReg("#CCCCCC");
      setBotonDeshabilitado(true);
    }
    
    if (!/\s/.test(formDatos.codigo)) {
      setMostrarTxtCodigo("");
    } else {
      setMostrarTxtCodigo("El código no puede contener espacios en blanco");
    }

    if (!Number.isNaN(formDatos.costoPuntos) && !/\s/.test(formDatos.costoPuntos)) {
      setMostrarTxtCostoPuntos("");
    } else {
      setMostrarTxtCostoPuntos("Costo en puntos inválido");
    }

    if (!Number.isNaN(formDatos.cantidadInicial) && !/\s/.test(formDatos.cantidadInicial)) {
      setMostrarTxtCantidadInicial("");
    } else {
      setMostrarTxtCantidadInicial("Cantidad inicial inválida");
    }

    if (!Number.isNaN(formDatos.ordenPriorizacion) && !/\s/.test(formDatos.ordenPriorizacion)) {
      setMostrarTxtOrdenPriorizacion("");
    } else {
      setMostrarTxtOrdenPriorizacion("Orden de priorización inválido");
    }

    if (startDate !== null ) {
      setMostrarTxtFechaExpiracion("");
    } else {
      setMostrarTxtFechaExpiracion("Fecha inválida");
    }

    if (files.length !== 0) {
      setMostrarTxtFile("");
    } else {
      setMostrarTxtFile("Archivo inválido");
    }
  },[formDatos.codigo,selectedTienda,selectedTipoCupon, formDatos.sumilla, 
      formDatos.descripcionCompleta, formDatos.terminosCondiciones, formDatos.costoPuntos, 
      formDatos.cantidadInicial, formDatos.ordenPriorizacion,startDate,files]); // Cierra correctamente con un corchete    

    return (
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
      <BasicBreadcrumbs />
       <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
          <ArrowBackIosIcon onClick={handleBack} style={{ cursor: 'pointer' }}/>
          <Typography variant="h2">Crear Cupón</Typography>
        </Stack>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Box sx={{ mt: 3 , borderRadius: '8px',  padding: '2%' , border: '2px solid #CCCCCC', backgroundColor: '#F5F5F5' }}>
          <p>
            <strong>(*) Todos los campos son obligatorios para poder crear un cupón</strong>
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
              <Grid item xs={3}>
                <TextField fullWidth 
                onChange={handleChange} 
                label="Código" name="codigo" />
                <input className="inputEspecialAC" type="text" value={mostrarTxtCodigo} onChange={handleChange} 
                style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'transparent',outline: 'none'}}
                disabled/>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="es-limitado-select-label">Es Limitado</InputLabel>
                  <Select
                    labelId="es-limitado-select-label"
                    id="es-limitado-select"
                    value={esLimitado}
                    onChange={handleLimitado}
                    label="Es Limitado"
                  >
                    <MenuItem value="1">Sí</MenuItem>
                    <MenuItem value="0">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel 
                  id="search-select-label" >Tienda</InputLabel>
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
                    label="Elegir Tienda"
                    onChange={(e) => setSelectedTienda(e.target.value)}
                    // This prevents rendering empty string in Select's value
                    // if search text would exclude currently selected option.

                  >
                    <ListSubheader>
                      <TextField
                        size="small"
                        autoFocus
                        placeholder="Busca una tienda por nombre..."
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
              {loading2 &&<Spinner id='loading' color='primary'/>}
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="search-tipo-select-label">Tipo de Cupon</InputLabel>
                  <Select
                    // Disables auto focus on MenuItems and allows TextField to be in focus
                    MenuProps={{ autoFocus: false }}
                    labelId="search-tipo-cupon-select-label"
                    id="search-tipo-cupon-select"
                    value={selectedTipoCupon}
                    label="Elegir tipo de cupon"
                    onChange={(e) => setSelectedTipoCupon(e.target.value)}

                  >
                    <ListSubheader>
                      <TextField
                        size="small"
                        autoFocus
                        placeholder="Busca un tipo de cupon por nombre..."
                        fullWidth
                        value={searchTermTipoCupones}
                        onChange={changeTermSearchTipoCupon}
                        onKeyDown={(e) => e.stopPropagation()} // Detener la propagación del evento
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon onClick={handleSearchTipoCupon} />
                            </InputAdornment>
                          )
                        }}

                      />
                    </ListSubheader>
                    {tipoCupones.map((option, i) => (
                      <MenuItem key={i} value={option.id}>
                        {option.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth onChange={handleChange}  label="Sumilla" name="sumilla" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth onChange={handleChange}  label="Descripción Completa" name="descripcionCompleta" multiline rows={4} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth onChange={handleChange}  label="Términos y Condiciones" name="terminosCondiciones" multiline rows={4} />
              </Grid>
              <Grid item xs={3}>
                <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale="de">
                <DatePicker
                  label="Fecha expiracion"
                  value={startDate}
                  format="DD/MM/YYYY"
                  onChange={setStartDate}
                  sx={{ width: '100%' , marginBottom: 0, paddingBottom: 0}}
                />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3} >
                <TextField fullWidth onChange={handleChange} label="Costo en Puntos" name="costoPuntos" />
                <input className="inputEspecialAC" type="text" value={mostrarTxtCostoPuntos} onChange={handleChange} 
                style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'transparent',outline: 'none'}}
                disabled/>
              </Grid>
              <Grid item xs={3} >
                <TextField fullWidth onChange={handleChange} label="Cantidad Inicial" name="cantidadInicial" />
                <input className="inputEspecialAC" type="text" value={mostrarTxtCantidadInicial} onChange={handleChange} 
                style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'transparent',outline: 'none'}}
                disabled/>
              </Grid>
              <Grid item xs={3} >
                <TextField fullWidth onChange={handleChange} label="Orden de Priorización" name="ordenPriorizacion" />
                <input className="inputEspecialAC" type="text" value={mostrarTxtOrdenPriorizacion} onChange={handleChange} 
                style={{width: "100%", color: 'red',border: 'none',backgroundColor: 'transparent',outline: 'none'}}
                disabled/>
              </Grid>
              </Grid>
            <Grid item xs={12}> 
            <Button variant="contained" color="info" 
            sx={{backgroundColor: backgroundBtnReg, color:"#FFFFFF" , fontSize: '1rem',marginTop: '16px', marginBottom: '0px'}}
            type='submit'
            disabled={botonDeshabilitado || loading2}>Crear</Button>
            </Grid>
          </form>
        </Box>
      </Container>
    );

  }