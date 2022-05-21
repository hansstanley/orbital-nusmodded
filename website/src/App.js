import logo from './logo.svg';
import './App.css';
import { Paper, ThemeProvider, Typography } from '@mui/material';
import { defaultTheme } from './themes';
import NavFrame from './components/NavFrame';
import Router from './components/routes';

function App() {
	return (
		<ThemeProvider theme={defaultTheme}>
			<NavFrame content={<Router />} />
		</ThemeProvider>
	);
}

export default App;
