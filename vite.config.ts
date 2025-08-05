import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/test-case-generator-workik/',
  server: {
    port: 5173,
    strictPort: true, // Exit if port is already in use
    host: true
  }
})
