import { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom'

import DashboardLayout from 'src/layouts/dashboard';

import { useAuth } from './AuthContext'

const PrivateRoutes = () => {
  const {user} = useAuth()

  return user ? <DashboardLayout>
    <Suspense>
      <Outlet />
    </Suspense>
  </DashboardLayout> : <Navigate to="/login"/>
}

export default PrivateRoutes