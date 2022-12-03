import { defineConfig } from 'cypress';

export default defineConfig({
	component: {
		specPattern: '**/*.cy.tsx',
		devServer: {
			framework: 'react',
			bundler: 'vite',
		},
	},
});
