import { Helmet } from 'react-helmet-async';
import {TiendaVisualizar } from 'src/sections/tiendas/view';

// ----------------------------------------------------------------------

export default function TiendaPage() {
  return (
    <>
      <Helmet>
        <title> Visualizar Tienda | Plaza San Miguel </title>
      </Helmet>

      <TiendaVisualizar />
    </>
  );
}