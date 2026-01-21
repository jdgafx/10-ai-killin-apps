import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vite configuration template for GitHub Pages deployment
 * 
 * This configuration is optimized for:
 * - GitHub Pages hosting with proper base path handling
 * - Multi-project monorepo deployments
 * - Environment variable injection from GitHub Secrets
 * - Production-ready asset optimization
 */

const projectName = process.env.PROJECT_NAME || 'app'
const isDev = process.env.NODE_ENV === 'development'
const isBuild = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],

  // Set base path for GitHub Pages subfolders
  // For projects deployed to: https://username.github.io/project-name/
  base: isDev ? '/' : `/${projectName}/`,

  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true,
  },

  build: {
    // Output directory
    outDir: 'dist',
    
    // Clear output directory before build
    emptyOutDir: true,

    // Minification and optimization settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Source maps for production debugging (optional)
    sourcemap: false,

    // Asset optimization
    assetsDir: 'assets',
    assetsInlineLimit: 4096,

    // Chunk size warnings
    chunkSizeWarningLimit: 500,

    // Rollup options for advanced bundling
    rollupOptions: {
      output: {
        // Split chunks for better caching
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
          ],
          'vendor-ui': [
            // Add UI dependencies here
          ],
          'vendor-ai': [
            // Add AI provider dependencies here
          ],
        },
        // Output file naming strategy
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'images/[name].[hash][extname]'
          } else if (/\.css$/.test(name ?? '')) {
            return 'css/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
        },
      },
    },

    // Reporting compressed size
    reportCompressedSize: true,
  },

  // Environment variable handling
  define: {
    // Expose environment variables at build time
    __DEV__: isDev,
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },

  css: {
    postcss: './postcss.config.js',
  },

  // Performance optimization hints
  ssr: {
    format: 'cjs',
  },
})
