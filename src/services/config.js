const envPrefix = 'VITE_';
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://poaa-api-267217237716.northamerica-northeast1.run.app'
    : 'http://localhost:4000';
const config = {
  apiUrl,
  env: {
    ENCRYPT_KEY: import.meta.env[`${envPrefix}ENCRYPT_KEY`],
    VAPID_PUBLIC_KEY: import.meta.env[`${envPrefix}VAPID_PUBLIC_KEY`],
    MODE: import.meta.env.MODE,
  },
};

export default config;
