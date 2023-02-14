// const apiUrl = 'http://localhost:4000';
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://seedbox-299206.el.r.appspot.com'
    : 'http://localhost:4000';
const config = {
  apiUrl,
};

export default config;
