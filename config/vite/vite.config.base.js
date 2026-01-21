import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../packages'),
      '@shared': path.resolve(__dirname, '../../packages/shared-ui'),
      '@utils': path.resolve(__dirname, '../../packages/utils'),
      '@ai': path.resolve(__dirname, '../../packages/ai-providers'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
    cors: true,
  },
  define: {
    'process.env': {},
  },
})
