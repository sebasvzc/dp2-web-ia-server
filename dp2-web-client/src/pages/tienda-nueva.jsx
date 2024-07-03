import { Helmet } from 'react-helmet-async';
import {TiendaNew} from 'src/sections/tiendas/view';

// ----------------------------------------------------------------------

export default function TiendasPage() {
  return (
    <>
      <Helmet>
        <title> Tienda Nueva | Plaza San Miguel </title>
      </Helmet>

      <TiendaNew />
    </>
  );
}