import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import vitePluginRequire from 'vite-plugin-require';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      svgr(),
      vitePluginRequire(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        selfDestroying: Boolean(env.VITE_UNREGISTER_SW),
      }),
    ],
  };
});
