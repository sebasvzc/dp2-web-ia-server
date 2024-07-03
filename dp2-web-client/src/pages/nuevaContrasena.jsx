import { Helmet } from 'react-helmet-async';

import {NuevaContrasenaView} from 'src/sections/forgottenPassword/nuevaContrasenia'

// ----------------------------------------------------------------------

export default function NuevaContrasenaPage() {
  return (
    <>
      <Helmet>
        <title> NuevaContrasena | Minimal UI </title>
      </Helmet>

      <NuevaContrasenaView/>

    </>
  );
}
