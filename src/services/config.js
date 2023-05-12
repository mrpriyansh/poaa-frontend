const envPrefix = 'VITE_';
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://poaa-api-r7g3efabnq-nn.a.run.app'
    : 'http://localhost:4000';
const config = {
  apiUrl,
  env: {
    ENCRYPT_KEY: import.meta.env[`${envPrefix}ENCRYPT_KEY`],
    VAPID_PUBLIC_KEY: import.meta.env[`${envPrefix}VAPID_PUBLIC_KEY`],
  },
};

export default config;
