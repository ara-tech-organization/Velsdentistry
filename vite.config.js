import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Default build (npm run build -> dist/) is for Hostinger: drvelsdentistry.com/clear-aligner/
// GitHub Pages build (npm run build:ghpages) is served from /Velsdentistry/.
export default defineConfig(({ mode }) => ({
  base: mode === 'ghpages' ? '/Velsdentistry/' : '/clear-aligner/',
  plugins: [react()],
}))
