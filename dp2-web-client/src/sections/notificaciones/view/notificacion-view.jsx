import { Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

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
import DialogContent from '@mui/material/DialogContent';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import obtenerNotificaciones from 'src/_mock/notificacion';

import Iconify from 'src/components/iconify';
import '../../../loading/Loading.css'
import BasicBreadcrumbs from '../../../routes/BasicBreadcrumbs'; 
import NotificacionTableRow from '../notificacion-table-row';
import NotificacionTableHead from '../notificacion-table-head';
import NotificacionTableToolbar from '../notificacion-table-toolbar';

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
  export default function NotificacionView() {
    const [order, setOrder] = useState('asc');
    const [searchName, setSearchName] = useState("");
    const [notificacionData, setNotificacionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [habilitarNotificaciones, setHabilitarNotificaciones] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [orderBy, setOrderBy] = useState('id');
    const [backgroundBtnHabilitar, setBackgroundBtnHabilitar] = useState("#CCCCCC");
    const [backgroundBtnDeshabilitar, setBackgroundBtnDeshabilitar] = useState("#CCCCCC");
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);


    const [loading2,setLoading2]=useState(false);



    const classes = useStyles();
    const filterName= useState('')

    const [totalNotificaciones, setTotalNotificaciones] = useState(10);

  console.log("Seleccionar")
  console.log(selected)
  console.log("Seleccionar")

  // Llama a la función obtenerNotificaciones para obtener y mostrar los datos de usuarios
    useEffect(() => {
      console.log("useEffect is running");
      console.log("page:", page);
      console.log("pageSize:", pageSize);
      console.log("searchName:", searchName);
      const fetchData = async () => {
        try {
          setLoading(true); // Indicate that loading has started
          console.log("ANTES")
          const data = await obtenerNotificaciones(page, pageSize, searchName); // Fetch notificacion data
          console.log("Notificaciones retornadas: ",data);

          if (data.newToken) {
            const storedNotificacion = localStorage.getItem('notificacion');
            const notificacionX = JSON.parse(storedNotificacion);
            notificacionX.token = data.newToken;
            localStorage.setItem('notificacion', JSON.stringify(notificacionX)); // Update the notificacion in local storage
            console.log("He puesto un nuevo token");
          }

          if (data.totalNotificaciones) {
            setTotalNotificaciones(data.totalNotificaciones);
          }
          setNotificacionData(data.notificaciones); // Update state with fetched notificacion data
        } catch (err) {
          setError(err); // Handle fetch errors
        } finally {
          setLoading(false); // Indicate that loading has finished, whether fetch succeeded or failed
        }
      };

      fetchData(); // Call the async function synchronously

      console.log("searchName despues de buscar", searchName);
    }, [page, pageSize, habilitarNotificaciones, searchName]);

    const [openModal, setOpenModal] = useState(false);
    const [openModalDesactivar, setOpenModalDesactivar] = useState(false);
    const [openModalActivar, setOpenModalActivar] = useState(false);
    const [email, setEmail] = useState('');
   
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
        const newSelecteds = notificacionData.map((n) => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    };
    const handleCambio = (event) => {
      console.log("camio de datos de usuario")
      setHabilitarNotificaciones(!habilitarNotificaciones);
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

    const handleEnviar = () => {

    };

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
    // const notFound = !notificacionData.length && !!filterName;
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
    } */
    /*
    if (error) {
      return <div>Error al cargar datos de usuarios</div>; // Manejar errores de obtención de datos
    }
    */

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
  
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
  
    const handleHourChange = (event) => {
      const value = event.target.value;
      if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 24)) {
        setHour(value);
      }
    };
  
    const handleMinuteChange = (event) => {
      const value = event.target.value;
      if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) < 60)) {
        setMinute(value);
      }
    };

    return (
      <Container sx={{  borderLeft: '1 !important', borderRight: '1 !important', maxWidth: 'unset !important' , padding: 0 }} >
        <BasicBreadcrumbs />
        <Typography variant="h2" sx={{ marginBottom: 2 }}>Gestión de Notificaciones</Typography>
        <hr style={{ borderColor: 'black', borderWidth: '1px 0 0 0', margin: 0 }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={-3}>
          <NotificacionTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleSearch}
          />
          <Stack direction="row" spacing={2}>
          <Button variant="contained" color="info" sx={{ marginRight: '8px' , backgroundColor: "#003B91", color:"#FFFFFF" }}
            onClick={handleOpenModal} startIcon={<Iconify icon ="icon-park-solid:config"/>}>
              Configurar
            </Button>
            <Dialog open={openModal} onClose={handleCloseModal} 
            fullWidth maxWidth="md" PaperProps={{ style: { maxHeight: '90vh' } }}>
              <DialogTitle>Configurar notificaciones</DialogTitle>
              <DialogContent>
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
                <Typography variant="body1">Configura la hora de llegada de las notificaciones en la app.</Typography>
              </Box>
              
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' , padding: '2%'}}>
                  <TextField
                    id="hour-input"
                    label="Hora"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={hour}
                    onChange={handleHourChange}
                    inputProps={{ min: 0, max: 24 }} // Restringir valor entre 0 y 24 para horas
                    sx={{ ml: '16px', width: '60px' }}
                  />
                  <Typography variant="body1" sx={{ mx: '8px' }}>:</Typography>
                  <TextField
                    id="minute-input"
                    label="Min"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={minute}
                    onChange={handleMinuteChange}
                    inputProps={{ min: 0, max: 59 }} // Restringir valor entre 0 y 59 para minutos
                    sx={{ width: '60px' }}
                  />
                </Box>

              </DialogContent>
              
              <DialogActions>
                <Button onClick={handleCloseModal} color="error" disabled={loading2}>
                  Cancelar
                </Button>
                <Button onClick={handleEnviar} color="success" disabled={loading2}>
                  Aceptar
                </Button>
              </DialogActions>
              
            </Dialog>
          </Stack>
        </Stack>
        {loading2 &&<Spinner id='loading' color='primary'/>}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <NotificacionTableHead
            order={order}
            orderBy={orderBy}
            rowCount={notificacionData.length}
            numSelected={selected.length}
            onRequestSort={handleSort}
            onSelectAllClick={handleSelectAllClick}
            headLabel={[

              { id: '' },
            ]}
          />
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
                  {notificacionData && notificacionData.length > 0 ? (
                    notificacionData.map((row) => (
                      <Grid item xs={12} key={row.id} >
                        <Box
                          key={row.id}
                          style={{
                            width: '100%', // Asegura que ocupe todo el ancho disponible
                            display: 'flex',
                            alignItems: 'center', // Alinea los elementos verticalmente al centro
                            padding: '8px', // Añade padding si es necesario
                            marginBottom: '8px', // Espaciado entre filas
                          }}
                        >
                          <NotificacionTableRow
                            name={row.name}
                            id={row.id}
                            cron={row.cron}
                            selected={selected.indexOf(row.id) !== -1}
                            handleClick={(event) => handleClick(event, row.id)}
                            onEditNotificacion={handleCambio}
                          />
                        </Box>
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
              count={totalNotificaciones}
              rowsPerPage={pageSize}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[6,12,18]}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Notificaciones por página"
              nextIconButtonProps={{ className: classes.hideNavigationButton }} // Oculta la flecha de la derecha
              backIconButtonProps={{ className: classes.hideNavigationButton }} // Oculta la flecha de la izquierda
              labelDisplayedRows={labelDisplayedRows} // Personaliza el texto de las filas visualizadas
            />
            
          </Grid>
          <Grid>
            <Pagination count={ Math.ceil(totalNotificaciones / pageSize)} showFirstButton showLastButton  onChange={handleChangePage}/>
          </Grid>

        </Grid>

      </Container>
    );
  }
