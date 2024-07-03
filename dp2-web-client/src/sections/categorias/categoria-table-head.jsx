import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './utils';

// ----------------------------------------------------------------------

export default function CategoriaTableHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const onSort = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{backgroundColor:"F9FAFB", color:'F9FAFB'}}>
      <TableRow style={{backgroundColor:"F9FAFB", color:'F9FAFB'}}>
        <TableCell padding="checkbox" style={{backgroundColor:"F9FAFB", color:'black'}}> 
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            style={{ backgroundColor: "F9FAFB", color: 'black'}} // Ajusta el valor de marginRight según sea necesario
          />
         <span>Seleccionar</span><span style={{ width: '5px', display: 'inline-block' }}>&nbsp;</span><span>todos</span>
        </div>

        </TableCell>

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
            style={{backgroundColor:"F9FAFB", color:'F9FAFB'}}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={onSort(headCell.id)}
              style={{backgroundColor:"F9FAFB", color:'F9FAFB'}}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

CategoriaTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
