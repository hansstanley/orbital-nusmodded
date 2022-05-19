import { createTheme } from '@mui/material';

const themeOptions = {
	palette: {
		type: 'light',
		primary: {
			main: '#222324',
		},
		secondary: {
			main: '#ec5e45',
		},
	},
};

export const defaultTheme = createTheme(themeOptions);
