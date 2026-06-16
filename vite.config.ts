import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Permite servir el dev server a través de túneles (para probar el flujo de
    // pago: MercadoPago necesita una URL pública para redirigir de vuelta).
    allowedHosts: [".trycloudflare.com", ".ngrok-free.dev", ".ngrok-free.app"],
  },
});
