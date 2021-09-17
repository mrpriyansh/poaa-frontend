import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, ...rest }) => {
  const location = useLocation();
  const authToken = window.localStorage.getItem('token');
  return (
    <Route {...rest}>
      {authToken ? (
        children
      ) : (
        <Redirect to={{ pathname: '/', state: { referer: location.pathname } }} />
      )}
    </Route>
  );
};

export default ProtectedRoute;
