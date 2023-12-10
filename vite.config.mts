import { defineConfig } from 'vite'

import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'
import Package from './package.json'

export default defineConfig(({ command, mode }) => {
   if (mode === 'app') {
      return {
         plugins: [react()],
      }
   }
   return {
      define: {
         ...(command === 'build' ? { 'import.meta.vitest': 'undefined' } : {}),
      },
      test: {
         includeSource: ['src/utils.ts'],
      },
      build: {
         lib: {
            name: Package.name,
            entry: 'src/index.ts',
            formats: ['es', 'cjs'],
            fileName: 'index',
         },
         rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
               banner: '"use client";',
               globals: {
                  react: 'React',
                  'react/jsx-runtime': 'React',
               },
            },
         },
      },
      plugins: [
         dts({
            rollupTypes: true,
         }),
      ],
   }
})
