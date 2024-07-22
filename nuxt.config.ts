import { quasar } from '@quasar/vite-plugin';

export default defineNuxtConfig({
  title: 'Test task',
  devtools: { enabled: true },

  plugins: [
    '~/plugins/pinia',
  ],

  compatibilityDate: '2024-07-19',

  css: [
    'quasar/src/css/index.sass',
    '@quasar/extras/material-icons/material-icons.css',
  ],
  build: {
    transpile: ['quasar'],
  },

  vite: {
    plugins: [
      quasar({
      })
    ]
  }
});
