import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass',
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'), // Alias para la carpeta src
    },
  },
})
