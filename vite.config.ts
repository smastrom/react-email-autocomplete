import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser';

import Package from './package.json';

export default defineConfig(({ command, mode }) => {
	if (mode === 'app') {
		return {
			plugins: [react()],
		};
	}
	return {
		define: {
			__DEV__: command !== 'build',
		},
		build: {
			minify: 'terser',
			lib: {
				name: Package.name,
				entry: 'src/index.ts',
				formats: ['es', 'umd'],
				fileName: (format) => {
					if (format === 'es') {
						return 'index.js';
					}
					return `index.${format}.min.js`;
				},
			},
			rollupOptions: {
				external: ['react', 'react/jsx-runtime'],
				input: 'src/index.ts',
				output: {
					globals: {
						react: 'React',
						'react/jsx-runtime': 'jsxRuntime',
					},
				},
				plugins: [
					terser({
						compress: {
							defaults: true,
							drop_console: false,
						},
					}),
				],
			},
		},
		plugins: [react()],
	};
});
