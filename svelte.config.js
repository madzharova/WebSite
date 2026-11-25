import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex({ extensions: ['.md'] })],
	kit: {
		adapter: adapter({ pages: process.env.PREVIEW ? 'build-preview' : 'build', assets: process.env.PREVIEW ? 'build-preview' : 'build', fallback: '404.html' }),
		appDir: process.env.PREVIEW ? 'app' : '_app',
		prerender: { handleHttpError: 'warn', handleMissingId: 'warn' }
	}
};

export default config;
