import { Helmet } from 'react-helmet-async';
import { CuponView} from 'src/sections/cupones/view';

// ----------------------------------------------------------------------

export default function CuponesPage() {
  return (
    <>
      <Helmet>
        <title> Cupon | Plaza San Miguel </title>
      </Helmet>

      <CuponView />
    </>
  );
}