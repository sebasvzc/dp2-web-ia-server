import { Helmet } from 'react-helmet-async';
import {ClientDetail} from 'src/sections/clientes/view';

// ----------------------------------------------------------------------

export default function ClientesPage() {
  return (
    <>
      <Helmet>
        <title> Detalle Cliente | Plaza San Miguel </title>
      </Helmet>

      <ClientDetail />
    </>
  );
}