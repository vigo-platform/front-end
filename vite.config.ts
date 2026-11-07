import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: process.env.VITE_BASE_APPLICATION_SERVER,
    port: Number(process.env.VITE_BASE_APPLICATION_PORT),
  }
})