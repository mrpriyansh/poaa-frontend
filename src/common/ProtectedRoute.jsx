import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAuth } from '../services/Auth';

const unautherizedPath = ['/login'];
const ProtectedRoute = ({ children, ...rest }) => {
  const { authToken } = useAuth();
  const location = useLocation();

  if (authToken) {
    return (
      <Route {...rest}>
        {unautherizedPath.includes(location.pathname) ? (
          <Redirect to={{ pathname: '/' }} />
        ) : (
          children
        )}
      </Route>
    );
  }
  return (
    <Route {...rest}>
      {unautherizedPath.includes(location.pathname) ? (
        children
      ) : (
        <Redirect to={{ pathname: '/login', state: { referer: location.pathname } }} />
      )}
    </Route>
  );
};

export default ProtectedRoute;
