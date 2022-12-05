// const apiUrl = 'http://localhost:4000';
const apiUrl =
  process.env.NODE_ENV === 'production' ? 'http://35.226.105.42:4000' : 'http://localhost:4000';
const config = {
  apiUrl,
};

export default config;
