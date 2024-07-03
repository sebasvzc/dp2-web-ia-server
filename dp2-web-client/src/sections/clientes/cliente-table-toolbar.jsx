import PropTypes from 'prop-types';
import React, { useState, useEffect} from 'react';

import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CuponTableToolbar({ numSelected, filterName, onFilterName }) {

  const [localFilterName, setLocalFilterName] = useState("");

  // Diego esto esta raro

  const handleIconClick = () => {

    onFilterName(localFilterName); // Llama a onFilterName con el valor actualizado
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setLocalFilterName(newValue); // Actualiza el estado local al cambiar el input
  };

  return (
    <Toolbar
      sx={{
        height: 120,
        display: 'flex',
        justifyContent: 'space-between',

        paddingLeft: '0 !important',

      }}
    >

      <OutlinedInput
        value={localFilterName}
        onChange={handleInputChange}
        placeholder="Buscar cliente por nombre, teléfono o correo"
        style={{ width: 500, height: 40, backgroundColor: "white" }}
      />
      <Button
        onClick={handleIconClick}
        style={{ minWidth: 0, marginLeft: '8px', backgroundColor: '#003B91', color: 'white' }}
      >
        <Iconify icon="eva:search-fill" style={{ width: 20, height: 20 }} />
      </Button>

        

    </Toolbar>
  );
}

CuponTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
