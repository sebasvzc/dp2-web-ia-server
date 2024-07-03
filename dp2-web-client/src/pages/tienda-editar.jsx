import { Helmet } from 'react-helmet-async';
import {TiendaEditar } from 'src/sections/tiendas/view';

// ----------------------------------------------------------------------

export default function TiendaPage() {
  return (
    <>
      <Helmet>
        <title> Editar Tienda | Plaza San Miguel </title>
      </Helmet>

      <TiendaEditar />
    </>
  );
}