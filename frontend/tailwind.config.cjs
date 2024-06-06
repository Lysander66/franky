const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,ts,jsx,tsx}'],

	theme: {
		extend: {}
	},

	plugins: [daisyui]
};

module.exports = config;
