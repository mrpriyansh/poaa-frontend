// const apiUrl = 'http://localhost:4000';
const apiUrl =
  process.env.NODE_ENV === 'production' ? 'https://poaa-api.onrender.com' : 'http://localhost:4000';
const config = {
  apiUrl,
};

export default config;
