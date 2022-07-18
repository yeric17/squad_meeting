import { sveltekit } from '@sveltejs/kit/vite';
import {resolve} from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve:{
		alias: {
			$css: resolve('./src/css'),
			$stores: resolve('./src/stores'),
			"$utils": resolve('./src/utils')
		}
	},
	server:{
		port: 3000
	}
};

export default config;
