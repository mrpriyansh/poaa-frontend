import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAuth } from '../services/Auth';

const ProtectedRoute = ({ children, ...rest }) => {
  const { authToken } = useAuth();
  const location = useLocation();

  return (
    <Route {...rest}>
      {authToken ? (
        children
      ) : (
        <Redirect to={{ pathname: '/login', state: { referer: location.pathname } }} />
      )}
    </Route>
  );
};

export default ProtectedRoute;
