import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server:{
    allowedHosts: [
      '77225b06-8bb0-4de2-843f-75ac4721ae65-00-gz4u5a1hikve.sisko.repl.co',
      '77225b06-8bb0-4de2-843f-75ac4721ae65-00-gz4u5a1hikve.sisko.replit.dev'
    ]
  },
})
