import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  return {
    // ✅ Vercel uchun faqat '/' bo‘lishi kerak
    base: '/',

    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    server: {
      host: '0.0.0.0', // Render yoki lokal test uchun
      port: 5173,
      open: true,
    },
  }
})
