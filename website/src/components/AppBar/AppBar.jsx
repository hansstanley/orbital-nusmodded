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
import MenuIcon from '@mui/icons-material/Menu';
import LightModeButton from './LightModeButton';

export default function AppBar(props) {
	const { handleDrawerToggle } = props;

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
				<LightModeButton />
			</Toolbar>
		</MuiAppBar>
	);
}
