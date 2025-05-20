import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  define: {
    'globalThis.crypto.getRandomValues': '() => {}'
  },
  plugins: [react()],
})
