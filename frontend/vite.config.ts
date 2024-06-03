import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(() => {
  return {
    base: '/',
    server: {
      port: 3001,
      open: true,
      host: '0.0.0.0'
    },
    resolve: {
      alias: Object.assign(
        {
          '@': path.resolve(__dirname, 'src'),
        }
      ),
    },
    plugins: [react()],
  }
})
