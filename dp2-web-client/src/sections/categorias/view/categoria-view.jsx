import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import obtenerCategorias  from 'src/_mock/categoria';

import Iconify from 'src/components/iconify';

import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs'; // Ruta corregida


import CategoriaTableRow from '../categoria-table-row';
import CategoriaTableHead from '../categoria-table-head';
import CategoriaTableToolbar from '../categoria-table-toolbar';

  const useStyles = makeStyles((theme) => ({
    hideNavigationButton: {
      display: 'none !important', // Oculta el botón de navegación
    },
    paginationContainer: {

      display: "inline-block"
    },
    centeredPagination: {
      margin: 'auto', // Centra horizontalmente el componente
      maxWidth: 'fit-content', // Ajusta el ancho al contenido
    },
    modalContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      padding: "40px",
      backgroundColor: 'white', // Fondo blanco
      boxShadow: 24,
      outline: 'none',
    },
    activo: {
      color: '#008000', // Verde oscuro para activo
      backgroundColor: '#C8E6C9', // Fondo verde claro para activo
      padding: '2px 6px',
      borderRadius: '4px',
    },
    inactivo: {
      color: '#FF0000', // Rojo para inactivo
      backgroundColor: '#FFCDD2', // Fondo rojo claro para inactivo
      padding: '2px 6px',
      borderRadius: '4px',
    },
  }));
  // ----------------------------------------------------------------------
  const scrollContainerStyle = {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 470px)',
    paddingRight: '0.1%',
    boxSizing: 'border-box', // Añade esta propiedad para incluir el padding en el ancho total
  };
  export default function CategoriaView() {
    const [order, setOrder] = useState('asc');
    const [searchName, setSearchName] = useState("all");
    const [categoriaData, setCategoriaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [habilitarCategorias, setHabilitarCategorias] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [orderBy, setOrderBy] = useState('id');
    const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
    const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);


    const classes = useStyles();
    const filterName= useState('');

    const [totalCategorias, setTotalCategorias] = useState(10);

    const [crearCategoria, setCrearCategoria] = useState({
      nombre: "",
      descripcion: "",
      activo: true,
    });
    const [botonModalHabilitado, setbotonModalHabilitado] = useState(true);
    const [backgroundBtnMod, setBackgroundBtnMod] = useState("#CCCCCC");
    const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
    const [mostrarTxtDes, setMostrarTxtDes] = useState("");

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCrearCategoria({ ...crearCategoria, [name]: value });
    };

  useEffect(() => {
    if(selected.length>0){
      setBackgroundBtnHabilitar("#198754");
      setBackgroundBtnDeshabilitar("#DC3545");
      setBotonDeshabilitado(false);
    }else{
      setBackgroundBtnHabilitar("#CCCCCC");
      setBackgroundBtnDeshabilitar("#CCCCCC");
      setBotonDeshabilitado(true);
    }
  }, [selected]);

  console.log("Seleccionar")
  console.log(selected)
  console.log("Seleccionar")

  
  const fetchData2 = async () => {
    try {
      setLoading(true); // Indicar que la carga ha finalizado
      const data = await obtenerCategorias(page,pageSize,searchName); // Obtener los datos de categorías
      console.log(data.cupones)
      if(data.newToken){
        const storedUser = localStorage.getItem('user');
        const userX = JSON.parse(storedUser);
        userX.token = data.newToken;
        localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el cupón en el almacenamiento local
        console.log("He puesto un nuevo token");
      }
      console.log("Total categorias owo: ", data.totalCatTiendas)
      if(data.totalCatTiendas){
        setTotalCategorias(data.totalCatTiendas);
      }
      console.log("Data Categorias:", data.cattiendas)
      setCategoriaData(data.cattiendas); // Actualizar el estado con los datos obtenidos
      setLoading(false); // Indicar que la carga ha finalizado

    } catch (err) {
      setError(err); // Manejar errores de obtención de datos
      setLoading(false); // Indicar que la carga ha finalizado (incluso en caso de error)
    }
  };


  const handleCategoriaUpdated = () => {
    fetchData2();  // Suponiendo que fetchData es la función que carga datos de categorías del servidor
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Indicar que la carga ha finalizado
        const data = await obtenerCategorias(page,pageSize,searchName); // Obtener los datos de categorías
        console.log("Estoy en la pagina:" , page);
        if(data.newToken){
          const storedUser = localStorage.getItem('user');
          const userX = JSON.parse(storedUser);
          userX.token = data.newToken;
          localStorage.setItem('user', JSON.stringify(userX)); // Actualiza el cupón en el almacenamiento local
          console.log("He puesto un nuevo token");
        }
        if(data.totalCatTiendas){
          setTotalCategorias(data.totalCatTiendas);
        }
        console.log("Data Categorias:", data.cattiendas)
        setCategoriaData(data.cattiendas); // Actualizar el estado con los datos obtenidos
        setLoading(false); // Indicar que la carga ha finalizado
  
      } catch (err) {
        setError(err); // Manejar errores de obtención de datos
        setLoading(false); // Indicar que la carga ha finalizado (incluso en caso de error)
      }
    };
    fetchData(); // Llamar a la función para obtener los datos al montar el componente
    console.log("searchName despues de buscar",searchName)
    }, [page, pageSize,searchName, habilitarCategorias]);

    useEffect(()=>{
      if(crearCategoria.nombre.length!==0 && crearCategoria.descripcion.length!==0){
        setBackgroundBtnMod("#003B91");
        setbotonModalHabilitado(false);
      }else{
        setBackgroundBtnMod("#CCCCCC");
        setbotonModalHabilitado(true);
      }

      if(crearCategoria.nombre.length!==0){
        setMostrarTxtNomb("");
      }else {
        setMostrarTxtNomb("Debe de ingresar un nombre para la Categoría")
      }

      if(crearCategoria.descripcion.length!==0){
        setMostrarTxtDes("");
      }else {
        setMostrarTxtDes("Debe de ingresar un nombre para la Categoría")
      }
    }, [crearCategoria.nombre, crearCategoria.descripcion])

    const [openModal, setOpenModal] = useState(false);
    const [openModalDesactivar, setOpenModalDesactivar] = useState(false);
    const [openModalActivar, setOpenModalActivar] = useState(false);
    const [email, setEmail] = useState('');

    const handleDeshabilitar = async () => {
     try {
        const response = await fetch('http://localhost:3000/api/categoriaTienda/deshabilitarCategoriaTiendaWeb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ selected }),
        });
        const data = await response.json();
        console.log(data); // Maneja la respuesta de la API según sea necesario
        setOpenModalDesactivar(false);
        setHabilitarCategorias(!habilitarCategorias);
        toast.success('Categoría deshabilitada exitosamente', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        // handleCloseModal(); // Cierra el modal después de enviar
      } catch (e) {
        console.error('Error al deshabilitar categoriaes:', e);
      }
    };
    const handleHabilitar = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/categoriaTienda/habilitarCategoriaTiendaWeb', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selected }),
        });
        const data = await response.json();
        console.log(data); // Maneja la respuesta de la API según sea necesario
        setHabilitarCategorias(!habilitarCategorias);
        setOpenModalActivar(false);
        toast.success('Categoría habilitada exitosamente', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
        // handleCloseModal(); // Cierra el modal después de enviar
      } catch (e) {
        console.error('Error al habilitar categoriaes:', e);
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


    const handleSelectAllClick = (event) => {

      console.log(searchName)
      if (event.target.checked) {
        const newSelecteds = categoriaData.map((n) => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };
    const handleCambio = (event) => {
      setHabilitarCategorias(!habilitarCategorias);
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

    const handleChangePage = (event, newPage) => {
      console.log("new page", newPage)
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setPage(1);
      setPageSize(parseInt(event.target.value, 10));
    };

    const handleSearch = (e) => {
      setSearchName(e)
      setPage(1);
      console.log(e);
    };
    const labelDisplayedRows = ({ from, to, count }) => `${from}-${to} de ${count}`;
    const handleOpenModalDesactivar = () => {
      setOpenModalDesactivar(true);
    };
    const handleCloseModalDesactivar = () => {
      console.log("desactivar")
      setOpenModalDesactivar(false);
    };
    const handleOpenModalActivar = () => {
      setOpenModalActivar(true);
    };
    const handleCloseModalActivar = () => {
      console.log("desactivar")
      setOpenModalActivar(false);
    };

    const handleOpenModal = () => {
      setOpenModal(true);
    };

    const handleCloseModal = () => {
      setOpenModal(false);
    };

    const handleCrear = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categoriaTienda/crearCategoriaTiendaWeb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            nombre: crearCategoria.nombre,
            descripcion: crearCategoria.descripcion,
            activo: crearCategoria.activo
          }),
        });
        const data = await response.json();
    
        if (data.resultado === 1) {
          // Si la categoría se crea exitosamente
          console.log('Categoría creada con éxito:', data);
          toast.success('Categoría creada exitosamente', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
          });
          // Actualizar la lista de categorías o cerrar modal aquí si es necesario
          handleCloseModal(); // Suponiendo que quieras cerrar el modal al crear la categoría
        } else {
          // Manejar el caso de nombre duplicado o errores desconocidos
          console.log('Error al crear categoría:', data.mensaje);
          toast.error(`Error al crear categoría: ${data.mensaje}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
          });
        }
      } catch (err) {
        console.error('Error al conectar con el servidor:', err);
        toast.error('Error al conectar con el servidor', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        });
      }
    };
    

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
    const notFound = !categoriaData.length && !!filterName;
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '25%',
            marginTop: '15%', // Ajusta la distancia desde la parte superior
          }}
        >
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return <div>Error al cargar datos de categorias</div>; // Manejar errores de obtención de datos
    }
    return (
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
        <BasicBreadcrumbs />
        <Typography variant="h2" sx={{ marginBottom: 2 }}>Gestión de Categorías</Typography>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={-3}>
          <CategoriaTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleSearch}
          />
          <Stack direction="row" spacing={2}>
            <Dialog open={openModalDesactivar} onClose={handleCloseModalDesactivar} 
             fullHeight maxHeight="md" >
              <DialogTitle sx={{ alignItems: 'center',textAlign:'center'}}>¿Estás seguro de que deseas deshabilitar el cupón seleccionado?</DialogTitle>

              <DialogActions sx={{ alignSelf: 'center',textAlign:'center'}}>
                <Button onClick={handleDeshabilitar} color="success">
                  Sí
                </Button>
                <Button onClick={handleCloseModalDesactivar} color="error">
                  No
                </Button>

              </DialogActions>
            </Dialog>
            <Dialog open={openModalActivar} onClose={handleCloseModalActivar}
            maxWidth="md" maxHeight="md" >
              <DialogTitle>¿Estás seguro de que deseas habilitar el cupón seleccionado?</DialogTitle>

              <DialogActions sx={{ alignSelf: 'center',textAlign:'center'}}>
                <Button onClick={handleHabilitar} color="success">
                  Sí
                </Button>
                <Button onClick={handleCloseModalActivar} color="error">
                  No
                </Button>

              </DialogActions>
            </Dialog>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <CategoriaTableHead
            order={order}
            orderBy={orderBy}
            rowCount={categoriaData.length}
            numSelected={selected.length}
            onRequestSort={handleSort}
            onSelectAllClick={handleSelectAllClick}
            headLabel={[

              { id: '' },
            ]}
          />
          <Stack direction="row" alignItems="right" justifyContent="space-between" mb={0}> 
            <Button variant="contained" color="info" sx={{ marginRight: '8px' , backgroundColor: "#003B91", color:"#FFFFFF" }}
              onClick={handleOpenModal} startIcon={<Iconify icon ="system-uicons:replicate-alt"/>}>
                Crear
              </Button>
              <Button variant="contained" color="success" sx={{ marginRight: '8px' , backgroundColor: backgroundBtnHabilitar, color:"#FFFFFF" }} 
              disabled={botonDeshabilitado}
              onClick={handleOpenModalActivar} startIcon={<Iconify icon="eva:plus-fill" />}>
                Habilitar
              </Button>
              <Button variant="contained" color="error" sx={{ backgroundColor: backgroundBtnDeshabilitar , color:"#FFFFFF" }}  
              disabled={botonDeshabilitado}
              onClick={handleOpenModalDesactivar} startIcon={<Iconify icon="bi:dash" />}>
                Deshabilitar
            </Button>
            <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title" >
              <div className={classes.modalContainer}>
                <Typography variant="h6" style={{ marginBottom: "20px" }}>Crear una Categoría</Typography>
                <Stack direction="column" spacing={1}>
                  <TextField
                    name="nombre"
                    label="Nombre"
                    value={crearCategoria.nombre}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="descripcion"
                    label="Descripcion"
                    value={crearCategoria.descripcion}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    multiline rows={5}
                  />
                </Stack>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: 20 }}>
                  <Button color="error" variant="contained" style={{backgroundColor: '#DC3545'}} onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button color="success" variant="contained"
                    onClick={handleCrear}
                    style={{ backgroundColor: backgroundBtnMod, mt: 3 , color: "white", marginLeft: '10px'}}
                    disabled={botonModalHabilitado}>
                    Guardar
                  </Button>
                </div>
              </div>
            </Modal>
          </Stack>
        </Stack>

        <Box sx={scrollContainerStyle}>
          <Grid container spacing={2}>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  marginLeft:'50%',
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
              <>
            {categoriaData && categoriaData.length > 0 ? (
              categoriaData.map((row) => (
                <Grid item xs={12} sm={6} md={4} key={row.id} >
                  <Card style={{ backgroundColor: '#F9FAFB' }}>
                    <CategoriaTableRow
                      nombre={row.nombre}
                      descripcion={row.descripcion}
                      id={row.id}
                      activo={row.activo}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      onEditCategoria={handleCambio}
                      onCategoriaUpdated={handleCategoriaUpdated}
                    />
                  </Card>
                </Grid>
              ))
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  marginLeft:'30%',
                  height: '25%',
                  marginTop: '15%', // Ajusta la distancia desde la parte superior
                  marginBottom: '15%',
                }}
              >

                <Typography variant="h6" sx={{ mt: 2 }}>
                  No se encontraron categoriaes para la búsqueda
                </Typography>
              </Box>
            )}
              </>
            )}
          </Grid>
      </Box>
        <Grid container justifyContent="center"> {/* Centra horizontalmente */}
          <Grid item>
            <TablePagination
              page={page-1}
              component="div"
              count={totalCategorias}
              rowsPerPage={pageSize}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[6, 12, 18]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Categorías por página"
              nextIconButtonProps={{ className: classes.hideNavigationButton }} // Oculta la flecha de la derecha
              backIconButtonProps={{ className: classes.hideNavigationButton }} // Oculta la flecha de la izquierda
              labelDisplayedRows={labelDisplayedRows} // Personaliza el texto de las filas visualizadas
            />
            <Pagination count={ Math.ceil(totalCategorias / pageSize)} showFirstButton showLastButton  onChange={handleChangePage}/>
          </Grid>

        </Grid>

      </Container>
    );
  }
