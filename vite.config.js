import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from "unplugin-auto-import/vite"
import Pages from "vite-plugin-pages"
import Layouts from "vite-plugin-vue-layouts"
import Vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0"
  },
  plugins: [
    vue(),
    vueDevTools(),
    Pages(),
    Layouts({ layoutsDirs: "./src/layouts", defaultLayout: "default" }),
    Vuetify(),
    AutoImport({ eslintrc: { enabled: true, filepath: "./.eslintrc-auto-import.json" }, imports: ['vue', 'vue-router'], vueTemplate: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@images': fileURLToPath(new URL("./src/assets/images", import.meta.url)),
      '@fakedb': fileURLToPath(new URL("./src/@fakedb", import.meta.url))
    }
  }
})
