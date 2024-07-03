import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState,useEffect} from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';

import Iconify from 'src/components/iconify';



// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
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
}));


export default function NotificacionTableRow({
                                      selected,
                                      id,
                                      name,
                                      cron,
                                      handleClick,
                                      onEditNotificacion
                                     }) {
  const [open, setOpen] = useState(null);

  const classes = useStyles();
  
  const [editedNotificacion, setEditedNotificacion] = useState({
    id,
    name,
    cron,
  });


  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const [openEdit, setOpenEdit] = useState(false); // Estado para controlar la apertura y cierre del modal
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenModalEdit = () => {
    console.log("open edit es true")
    setOpenEdit(true);
  };

  const handleCloseModalEdit = () => {
    setOpenEdit(false);
  };

  const formatNumber = (num) => num.toString().padStart(2, '0');

  const [mostrarTxtNomb, setMostrarTxtNomb] = useState("");
  const [mostrarTxtApp, setMostrarTxtApp] = useState("");
  const [mostrarTxtCorreo, setMostrarTxtCorreo] = useState("");

  const [backgroundBtnMod, setBackgroundBtnMod] = useState("#CCCCCC");
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(true);

  return (
    <>
      <Card variant="outlined" sx={{ marginBottom: 1.5, border: -2, background: 'linear-gradient(to bottom, rgba(135, 206, 250, 0.05), rgba(0, 191, 255, 0.01))', width: '100%' }}>
      <CardContent sx={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{width: '100%' }}>
            <Typography variant="h6" component="div">
              {name}
            </Typography>
            <Typography variant="body1" component="div">
              {formatNumber(cron.hour)}:{formatNumber(cron.minute)}
          </Typography>
          </div>
        </div>
      </CardContent>
      
    </Card>

    </>
  );
}

NotificacionTableRow.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  onEditNotificacion: PropTypes.func.isRequired,
  cron: PropTypes.shape({
    minute: PropTypes.string.isRequired,
    hour: PropTypes.string.isRequired,
    dayOfMonth: PropTypes.string,
    month: PropTypes.string,
    dayOfWeek: PropTypes.string
  }).isRequired
};