import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      svgr(),

      VitePWA({
        registerType: 'autoUpdate',
        outDir: path.resolve(__dirname, 'public'),
        manifest: manifest,
        manifestFilename: 'manifest.json',
        selfDestroying: Boolean(env.VITE_UNREGISTER_SW),
        devOptions: { enabled: true, disableRuntimeConfig: false, type: 'module' },

        injectRegister: false,

        srcDir: 'src/',
        filename: 'sw.js',
        strategies: 'injectManifest',

        workbox: {
          globDirectory: path.resolve(__dirname, 'public'),
          globPatterns: ['{build,images,sounds,icons}/**/*.{jsx,js,css,html,ico,png,jpg,mp4,svg}'],
        },
      }),
    ],
  };
});

const manifest = {
    "name": "Post Office Agent Assistant",
    "short_name": "POAA",
    "start_url": ".",
    "display": "standalone",
    "background_color": "#000",
    "lang": "en",
    "scope": "/",
    "icons": [
        {
            "src": "favicon.ico",
            "sizes": "64x64 24x24",
            "type": "image/x-icon"
        },
		{
            "src": "logo16.png",
            "type": "image/png",
            "sizes": "16x16"
        },
        {
            "src": "logo32.png",
            "type": "image/png",
            "sizes": "32x32"
        },{
            "src": "logo192.png",
            "type": "image/png",
            "sizes": "192x192"
        },
        {
            "src": "logo512.png",
            "type": "image/png",
            "sizes": "512x512"
        }
    ],
    "theme_color": "#fff"
};
