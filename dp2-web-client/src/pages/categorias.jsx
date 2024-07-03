import { Helmet } from 'react-helmet-async';

import { CategoriaView } from 'src/sections/categorias/view';

// ----------------------------------------------------------------------

export default function CategoriasPage() {
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <CategoriaView />
    </>
  );
}
