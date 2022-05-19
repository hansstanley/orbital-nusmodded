import React from 'react';
import { CssBaseline, Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import ModdedAppBar from './ModdedAppBar';
import ModdedDrawer from './ModdedDrawer';

const DRAWER_WIDTH = 240;

export default function NavFrame(props) {
	const { content } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<ModdedAppBar handleDrawerToggle={handleDrawerToggle} />
			<ModdedDrawer
				drawerWidth={DRAWER_WIDTH}
				mobileOpen={mobileOpen}
				handleDrawerToggle={handleDrawerToggle}
			/>
			<Box
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
				}}>
				<Toolbar />
				{content}
			</Box>
		</Box>
	);
}
