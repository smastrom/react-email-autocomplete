import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser';
import Package from './package.json';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default defineConfig(({ command, mode }) => {
	if (mode === 'app') {
		return {
			plugins: [react()]
		};
	}
	return {
		define: {
			...(command === 'build' ? { 'import.meta.vitest': 'undefined' } : {})
		},
		test: {
			includeSource: ['src/utils.ts']
		},
		build: {
			minify: 'terser',
			lib: {
				name: Package.name,
				entry: 'src/index.ts',
				formats: ['es', 'umd'],
				fileName: (format) => (format === 'es' ? 'index.js' : 'index.umd.js')
			},
			rollupOptions: {
				external: ['react', 'react/jsx-runtime'],
				output: {
					globals: {
						react: 'React',
						'react/jsx-runtime': 'React'
					}
				},
				plugins: [
					terser({
						compress: {
							defaults: true
						}
					})
				]
			}
		},
		plugins: [react()]
	};
});
