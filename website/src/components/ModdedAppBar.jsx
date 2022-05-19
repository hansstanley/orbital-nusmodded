import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function ModdedAppBar(props) {
	const { handleDrawerToggle } = props;

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Toolbar>
					<IconButton
						color="inherit"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" noWrap>
						NUSModded
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
