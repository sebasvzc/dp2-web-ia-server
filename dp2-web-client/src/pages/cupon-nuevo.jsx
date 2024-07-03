import { Helmet } from 'react-helmet-async';
import { CuponNew} from 'src/sections/cupones/view';

// ----------------------------------------------------------------------

export default function CuponesPage() {
  return (
    <>
      <Helmet>
        <title> Nuevo Cupon | Plaza San Miguel </title>
      </Helmet>

      <CuponNew />
    </>
  );
}