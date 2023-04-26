import axios from 'axios';
import config from './config';
import { triggerAlert } from './getAlert/getAlert';
import handleError from './handleError';

const createInstance = method => {
  const instance = axios.create({
    baseURL: `${config.apiUrl}/api`,
  });

  // TODO : NEED TO change token1
  const token = window.localStorage.getItem('token1');
  if (token?.length) instance.defaults.headers.Authorization = `Bearer ${token}`;
  instance.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      handleError(err, triggerAlert);
      return Promise.reject(err);
    }
  );
  return instance[method];
};

// eslint-disable-next-line import/prefer-default-export
export const axiosUtil = {
  get: (endpoint, options) => createInstance('get')(endpoint, { ...options }),
  post: (endpoint, options) => createInstance('post')(endpoint, { ...options }),
  put: (endpoint, options) => createInstance('put')(endpoint, { ...options }),
  delete: (endpoint, options) => createInstance('delete')(endpoint, { ...options }),
};
