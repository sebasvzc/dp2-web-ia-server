import { Helmet } from 'react-helmet-async';

import { NotificacionView } from 'src/sections/notificaciones/view';

// ----------------------------------------------------------------------

export default function NotificacionesPage() {
  return (
    <>
      <Helmet>
        <title> Notificacion | Plaza San Miguel </title>
      </Helmet>

      <NotificacionView />
    </>
  );
}
