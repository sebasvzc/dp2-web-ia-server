import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import breadcrumbConfig from './breadcrumbConfig';

const BasicBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (to) => {
    if (to === '*') return breadcrumbConfig['*'];

    const route = Object.keys(breadcrumbConfig).find(key => {
      if (key === '*') return false;
      const regex = new RegExp(`^${key.replace(/:\w+/g, '\\w+')}$`);
      return regex.test(to);
    });
    return breadcrumbConfig[route] || '';
  };

  const getBaseRoute = (to) => {
    const route = Object.keys(breadcrumbConfig).find(key => {
      if (key === '*') return false;
      const regex = new RegExp(`^${key.replace(/:\w+/g, '\\w+')}$`);
      return regex.test(to);
    });
    return route ? route.replace(/:\w+/g, '') : to;
  };

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" to="/">
          {breadcrumbConfig['/']}
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const breadcrumbName = getBreadcrumbName(to);
          const baseRoute = getBaseRoute(to);
          const last = index === pathnames.length - 1;

          if (!breadcrumbName) return null;

          return last ? (
            <Typography color="text.primary" key={to}>
              {breadcrumbName}
            </Typography>
          ) : (
            <Link underline="hover" color="inherit" to={baseRoute} key={to}>
              {breadcrumbName}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
};

export default BasicBreadcrumbs;
