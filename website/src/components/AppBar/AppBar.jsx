import {
	AppBar as MuiAppBar,
	Box,
	Button,
	IconButton,
	Toolbar,
	Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function AppBar(props) {
	const { handleDrawerToggle } = props;

	return (
		<Box sx={{ flexGrow: 1 }}>
			<MuiAppBar
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
					<Typography
						variant="h5"
						component="div"
						color="secondary"
						noWrap>
						NUSMODDED
					</Typography>
					<Box sx={{ flex: 1 }} />
					<Button variant="contained" color="secondary">
						LOGIN
					</Button>
				</Toolbar>
			</MuiAppBar>
		</Box>
	);
}
