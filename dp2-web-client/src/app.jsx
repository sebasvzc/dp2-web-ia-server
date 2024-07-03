/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import 'react-toastify/dist/ReactToastify.css';
import ThemeProvider from 'src/theme';
import RouterX from 'src/routes/sections';
import BasicBreadcrumbs from 'src/routes/BasicBreadcrumbs';
import { ToastContainer } from 'react-toastify';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <RouterX />
      <ToastContainer/>
    </ThemeProvider>

  );
}
