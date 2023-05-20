/* eslint-disable camelcase */
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useAuth } from '../services/Auth';

export default function ForceLogout({ data }) {
  const { setAuthToken } = useAuth();
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) return;
    const decodedToken = jwt_decode(token);
    const tokenTimestamp = decodedToken.iat;
    const logoutTimestamp = data.metaInfo.timestamp;
    if (tokenTimestamp < logoutTimestamp) {
      window.localStorage.removeItem('token');
      setAuthToken(null);
    }
  }, [data, setAuthToken]);
  return null;
}
