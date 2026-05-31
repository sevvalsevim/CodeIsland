import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Game Programming Dersi - Python Island Game
// Hazırlayanlar: Şevval Sevim, Ayşegül Yavuz, Mine Uyanık

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
