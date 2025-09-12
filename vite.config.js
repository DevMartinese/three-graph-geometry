// Reemplaza tu vite.config.js actual con esto:
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ThreeGraphGeometry',
      fileName: 'three-graph-geometry',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['three', 'lil-gui'],
      output: {
        globals: {
          three: 'THREE'
        }
      }
    }
  }
})