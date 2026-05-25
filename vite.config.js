import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation libraries
          'vendor-gsap': ['gsap', 'gsap/ScrollTrigger', 'gsap/ScrollToPlugin'],
          // 3D libraries
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Charts (large)
          'vendor-charts': ['recharts'],
          // Maps
          'vendor-maps': ['leaflet'],
          // Icons
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit (we're intentionally splitting)
    chunkSizeWarningLimit: 300,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})