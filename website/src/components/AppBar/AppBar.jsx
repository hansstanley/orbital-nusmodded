import {
	AppBar as MuiAppBar,
	Box,
	Button,
	IconButton,
	Toolbar,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';
import AppTitle from './AppTitle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import MenuIcon from '@mui/icons-material/Menu';

export default function AppBar(props) {
	const { handleDrawerToggle, toggleColorMode } = props;

	const navigate = useNavigate();

	return (
		<MuiAppBar
			position="fixed"
			color="background"
			sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
			<Toolbar>
				<IconButton
					color="primary"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { sm: 'none' } }}>
					<MenuIcon />
				</IconButton>
				<AppTitle />
				<Box sx={{ flex: 1 }} />
				<SearchBox />
				<Button
					variant="contained"
					color="primary"
					onClick={() => navigate('/login')}>
					LOGIN
				</Button>
				<IconButton onClick={toggleColorMode} sx={{ ml: 1 }}>
					<Brightness4Icon />
				</IconButton>
			</Toolbar>
		</MuiAppBar>
	);
}
