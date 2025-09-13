import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow LAN + external hosts
    allowedHosts: [
      'resist-latinas-import-began.trycloudflare.com', // your ngrok domain
    ],
  },
})
