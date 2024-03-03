import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    server: {
      host: "0.0.0.0",  // publicly available
      port: 5173
     },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // replace this port with any number you want
  },
})
