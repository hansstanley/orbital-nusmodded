import { createTheme } from '@mui/material';

const themeOptions = {
	palette: {
		mode: 'light',
		primary: {
			light: '#ff8f71',
			main: '#ec5e45',
			dark: '#b32b1c',
		},
		secondary: {
			light: '#83ffff',
			main: '#45d3ec',
			dark: '#00a1ba',
		},
	},
};

const lightTheme = createTheme(themeOptions);

export default lightTheme;
