import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),tailwindcss(),],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Group large React-related dependencies
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
           
          
          }
        }
      },
      chunkSizeWarningLimit: 1000 // adjust as needed
    }
})
