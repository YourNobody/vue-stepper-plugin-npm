import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './dist',
    lib: {
      name: 'vue-stepper-lib',
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: (format) => `vue-stepper.${format}.js`,
    },
    reportCompressedSize: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [vue({ reactivityTransform: true })],
});
