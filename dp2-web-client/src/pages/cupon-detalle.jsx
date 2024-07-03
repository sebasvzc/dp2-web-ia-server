import { Helmet } from 'react-helmet-async';
import {CuponDetail } from 'src/sections/cupones/view';

// ----------------------------------------------------------------------

export default function CuponesPage() {
  return (
    <>
      <Helmet>
        <title> Detalle Cupon | Plaza San Miguel </title>
      </Helmet>

      <CuponDetail />
    </>
  );
}