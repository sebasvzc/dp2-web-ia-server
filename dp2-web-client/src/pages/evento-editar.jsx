import { Helmet } from 'react-helmet-async';
import { EventoEdit } from 'src/sections/eventos/view';

// ----------------------------------------------------------------------

export default function EventosPage() {
  return (
    <>
      <Helmet>
        <title> Detalle Evento | Plaza San Miguel </title>
      </Helmet>

      <EventoEdit />
    </>
  );
}