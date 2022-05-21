import React from 'react';
import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import AppBar from './AppBar';
import NavDrawer from './NavDrawer';

const DRAWER_WIDTH = 240;

export default function NavFrame(props) {
	const { children } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar handleDrawerToggle={handleDrawerToggle} />
			<NavDrawer
				drawerWidth={DRAWER_WIDTH}
				mobileOpen={mobileOpen}
				handleDrawerToggle={handleDrawerToggle}
			/>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 2,
					width: { xs: '100%', sm: `calc(100% - ${DRAWER_WIDTH}px)` },
				}}>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
}
