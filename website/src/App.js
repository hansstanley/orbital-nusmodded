import logo from './logo.svg';
import './App.css';
import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import ModdedAppBar from './components/ModdedAppBar';
import { defaultTheme } from './themes';
import ModdedDrawer from './components/ModdedDrawer';
import NavFrame from './components/NavFrame';

function App() {
	return (
		<ThemeProvider theme={defaultTheme}>
			<NavFrame
				content={<Typography variant="h4">Hello there!</Typography>}
			/>
		</ThemeProvider>
	);
}

export default App;
