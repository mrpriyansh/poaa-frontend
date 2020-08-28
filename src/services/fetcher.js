/* eslint-disable no-undef */
function fetcher(url) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());
}

export default fetcher;
