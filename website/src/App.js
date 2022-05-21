// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Paper, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './themes';
import { NavFrame, Router } from './components';

function App() {
	const [lightMode, setLightMode] = React.useState(true);

	const toggleColorMode = () => {
		setLightMode(!lightMode);
	};

	return (
		<ThemeProvider theme={lightMode ? lightTheme : darkTheme}>
			<NavFrame toggleColorMode={toggleColorMode}>
				<Paper elevation={5} sx={{ flexGrow: 1, p: 2 }}>
					<Router />
				</Paper>
			</NavFrame>
		</ThemeProvider>
	);
}

export default App;
