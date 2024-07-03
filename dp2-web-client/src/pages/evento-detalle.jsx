import { Helmet } from 'react-helmet-async';
import { EventoDetail } from 'src/sections/eventos/view';

// ----------------------------------------------------------------------

export default function EventosPage() {
  return (
    <>
      <Helmet>
        <title> Detalle Evento | Plaza San Miguel </title>
      </Helmet>

      <EventoDetail />
    </>
  );
}