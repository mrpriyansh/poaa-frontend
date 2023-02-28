// const apiUrl = 'http://localhost:4000';
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://poaa-api-r7g3efabnq-nn.a.run.app'
    : 'http://localhost:4000';
const config = {
  apiUrl,
};

export default config;
