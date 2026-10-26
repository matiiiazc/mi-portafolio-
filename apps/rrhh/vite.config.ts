import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  root,
  base: '/demos/rrhh/',
  plugins: [react(), tailwindcss()],
  build: { outDir: resolve(root, '../../public/demos/rrhh'), emptyOutDir: true },
})
