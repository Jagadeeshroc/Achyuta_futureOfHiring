import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  optimizeDeps: {
    force: true, // Add this
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#4facfe',
          500: '#3a8fd9',
        },
        secondary: {
          400: '#00f2fe',
          500: '#00c8e6',
        },
        dark: {
          900: '#0f2027',
          800: '#203a43',
          700: '#2c5364',
        },
      },
      animation: {
        'shine': 'shine 3s infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'rotate(45deg) translateX(-100%)' },
          '100%': { transform: 'rotate(45deg) translateX(100%)' },
        }
      }
    },
  },
 
  plugins: [
    react(),tailwindcss(),],
   define: {'process.env': 'import.meta.env', global: 'globalThis', },
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
    },
   
    
  hmr: {
      overlay: false
    },
  resolve: {
    alias: {
      '@': '/src',  // Optional but helpful alias
    }
  }
})
