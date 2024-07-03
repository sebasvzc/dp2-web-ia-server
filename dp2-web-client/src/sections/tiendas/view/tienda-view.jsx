import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import obtenerTiendas  from 'src/_mock/tienda';

import Iconify from 'src/components/iconify';
import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs';
import TiendaTableRow from '../tienda-table-row';
import TiendaTableHead from '../tienda-table-head';
import TiendaTableToolbar from '../tienda-table-toolbar';

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
  }));
  // ----------------------------------------------------------------------
  const scrollContainerStyle = {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 470px)',
    paddingRight: '0.1%',
    boxSizing: 'border-box', // Añade esta propiedad para incluir el padding en el ancho total
  };
  export default function TiendasView() {
    const [order, setOrder] = useState('asc');
    const [searchName, setSearchName] = useState("all");
    const [tiendaData, setTiendaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [habilitarTiendas, setHabilitarTiendas] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [orderBy, setOrderBy] = useState('id');
    const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
    const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);


    const classes = useStyles();
    const filterName= useState('')

    const [totalTiendas, setTotalTiendas] = useState(10);

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

  // Llama a la función obtenerTiendas para obtener y mostrar los datos de usuarios
    useEffect(() => {

    const fetchData = async () => {
        try {
          setLoading(true); // Indicar que la carga ha finalizado
          const data = await obtenerTiendas(page,pageSize,searchName); // Obtener los datos de usuarios
          console.log(data.tiendas)
          if(data.newToken){
            const storedTienda = localStorage.getItem('tienda');
            const tiendaX = JSON.parse(storedTienda);
            tiendaX.token = data.newToken;
            localStorage.setItem('tienda', JSON.stringify(tiendaX)); // Actualiza el usuario en el almacenamiento local
            console.log("He puesto un nuevo token");
          }

          if(data.totalTiendas){
            setTotalTiendas(data.totalTiendas);
          }
          setTiendaData(data.tiendas); // Actualizar el estado con los datos obtenidos
          setLoading(false); // Indicar que la carga ha finalizado

        } catch (err) {
          setError(err); // Manejar errores de obtención de datos
          setLoading(false); // Indicar que la carga ha finalizado (incluso en caso de error)
        }
      };

      fetchData(); // Llamar a la función para obtener los datos al montar el componente
      console.log("searchName despues de buscar",searchName)
    }, [page, pageSize, habilitarTiendas,searchName]);

    const [openModal, setOpenModal] = useState(false);
    const [openModalDesactivar, setOpenModalDesactivar] = useState(false);
    const [openModalActivar, setOpenModalActivar] = useState(false);
    const [email, setEmail] = useState('');
   
    const user = localStorage.getItem('user');
    const userStringify = JSON.parse(user);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;
    
    const handleDeshabilitar = async () => {
      console.log("Probando deshabilitar");
      console.log(selected)
      try {
        const response = await fetch('http://localhost:3000/api/tiendas/deshabilitar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },
          body: JSON.stringify({ selected }),
        });
        const data = await response.json();
        console.log(data); // Maneja la respuesta de la API según sea necesario
        setOpenModalDesactivar(false);
        setHabilitarTiendas(!habilitarTiendas);
        toast.success('Tienda deshabilitado exitosamente', {
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
        console.error('Error al deshabilitar usuarios:', e);
      }
    
    };
    const handleHabilitar = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tiendas/habilitar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Refresh-Token': `Bearer ${refreshToken}`
          },
          body: JSON.stringify({ selected }),
        });
        const data = await response.json();
        console.log(data); // Maneja la respuesta de la API según sea necesario
        setHabilitarTiendas(!habilitarTiendas);
        setOpenModalActivar(false);
        toast.success('Tienda habilitado exitosamente', {
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
        console.error('Error al habilitar usuarios:', e);
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

    const navigate = useNavigate();

    const handleCrear = () => {
      navigate('/tienda/tienda-new'); // Redirige al usuario a la ruta especificada
    };

    const handleSelectAllClick = (event) => {

      console.log(searchName)
      if (event.target.checked) {
        const newSelecteds = tiendaData.map((n) => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };
    const handleCambio = (event) => {
      console.log("camio de datos de usuario")
      setHabilitarTiendas(!habilitarTiendas);
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

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
    
    // const notFound = !tiendaData.length && !!filterName;
    /* if (loading) {
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
    */
    if (error) {
      return <div>Error al cargar datos de cupones</div>; // Manejar errores de obtención de datos
    }
    return (
      
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
        <BasicBreadcrumbs />
        <Typography variant="h2" sx={{ marginBottom: 1 }}>Gestión de Tiendas</Typography>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={-3}>
          <TiendaTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleSearch}
          />
          <Stack direction="row" spacing={2}>
            <Dialog open={openModalDesactivar} onClose={handleCloseModalDesactivar} 
             fullHeight maxHeight="md" >
              <DialogTitle sx={{ alignItems: 'center',textAlign:'center'}}>¿Estás seguro de que deseas deshabilitar la(s) tienda(s) seleccionada(s)?</DialogTitle>

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
              <DialogTitle>¿Estás seguro de que deseas habilitar la(s) tienda(s) seleccionada(s)?</DialogTitle>

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
          <TiendaTableHead
            order={order}
            orderBy={orderBy}
            rowCount={tiendaData.length}
            numSelected={selected.length}
            onRequestSort={handleSort}
            onSelectAllClick={handleSelectAllClick}
            headLabel={[

              { id: '' },
            ]}
          />
          <Stack direction="row" alignItems="right" justifyContent="space-between" mb={0}> 
          <Button variant="contained" color="info" sx={{ marginRight: '8px' , backgroundColor: "#003B91", color:"#FFFFFF" }}
            onClick={handleCrear} startIcon={<Iconify icon ="mingcute:shop-fill"/>}>
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
                  height: 'auto', // Permite que el contenido se ajuste automáticamente
                  mt: '10%', // Ajusta la distancia desde la parte superior
                  mb: '10%', // Ajusta la distancia desde la parte inferior
                  width: '100%', 
                }}
              >
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Cargando...
                </Typography>
              </Box>
            ) : (
              <>
            {tiendaData && tiendaData.length > 0 ? (
              tiendaData.map((row) => (
                <Grid item xs={12} sm={6} md={4} key={row.id} >
                  <Card style={{ backgroundColor: '#F9FAFB' }}>
                    <TiendaTableRow
                      nombre={row.nombre}
                      rutaFoto={row.rutaFoto}
                      locacion={row.locacion}
                      descripcion={row.descripcion}
                      id={row.id}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      activo={row.activo}
                      onEditTienda={handleCambio}
                     aforo={row.activo}/>
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
                  No se encontraron usuarios para la búsqueda
                </Typography>
              </Box>
            )}
              </>
            )}
          </Grid>
      </Box>
        <Grid container direction="column" justifyContent="center" alignItems="center"> {/* Centra horizontalmente */}
          <Grid item>
            <TablePagination
              page={page-1}
              component="div"
              count={totalTiendas}
              rowsPerPage={pageSize}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[6, 12, 18]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Tiendas por página"
              nextIconButtonProps={{ className: classes.hideNavigationButton }} // Oculta la flecha de la derecha
              backIconButtonProps={{ className: classes.hideNavigationButton }} // Oculta la flecha de la izquierda
              labelDisplayedRows={labelDisplayedRows} // Personaliza el texto de las filas visualizadas
            />
          </Grid>
          <Grid item>
            <Pagination count={ Math.ceil(totalTiendas / pageSize)} showFirstButton showLastButton  onChange={handleChangePage}/>
          </Grid>

        </Grid>

      </Container>
    );
  }
