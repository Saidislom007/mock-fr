import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    // 🔑 Agar GitHub Pages’da deploy qilsangiz — bu yerda repo nomini yozing
    // Render yoki Vercel’da esa faqat '/' bo‘lib qolishi kerak
    base: isDev ? '/' : '/cdi-front/',

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
