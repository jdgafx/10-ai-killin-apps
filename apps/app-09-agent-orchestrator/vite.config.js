import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'ai-providers': path.resolve(__dirname, '../../packages/ai-providers/src')
    }
  },
  server: {
    port: 3009
  }
})
