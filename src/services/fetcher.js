/* eslint-disable no-undef */
import axios from 'axios';

function fetcher(url) {
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
  });
}

export default fetcher;
