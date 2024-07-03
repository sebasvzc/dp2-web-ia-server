import { Helmet } from 'react-helmet-async';
import {CuponEdit } from 'src/sections/cupones/view';

// ----------------------------------------------------------------------

export default function CuponesPage() {
  return (
    <>
      <Helmet>
        <title> Editar Cupon | Plaza San Miguel </title>
      </Helmet>

      <CuponEdit />
    </>
  );
}