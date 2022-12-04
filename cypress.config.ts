import { defineConfig } from 'cypress';

export default defineConfig({
	component: {
		specPattern: '**/*.cy.tsx',
		devServer: {
			framework: 'react',
			bundler: 'vite',
		},
		setupNodeEvents(on) {
			on('task', {
				log(message) {
					console.log(message);
					return null;
				},
			});
		},
	},
});
