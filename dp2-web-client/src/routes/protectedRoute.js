

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/AuthContext';

const ProtectedRoute = ({ requiredPermissions, children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Optional: you can return a loading spinner or a message here
  }

  const perms = user.permisos || [];
  const permsUser = perms.map(perm => perm.permission.nombre);

  const hasPermission = requiredPermissions.every(permission => {
    const isIncluded = permsUser.includes(permission);
    console.log(`Checking permission: ${permission}, Included: ${isIncluded}`);
    return isIncluded;
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!hasPermission) {
      console.log("Debería redirigir");
      navigate('/Error404'); // Redirigir a una página de acceso denegado o a la página de inicio
    }
  }, [hasPermission, navigate]);

  if (!hasPermission) {
    return null; // Optional: you can return a message or a redirect component here
  }

  return children;
};

ProtectedRoute.propTypes = {
  requiredPermissions: PropTypes.array.isRequired,
  children: PropTypes.node
};

export default ProtectedRoute;