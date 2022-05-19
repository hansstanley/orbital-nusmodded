import React from 'react';
import {
	Box,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';

export default function ModdedDrawer(props) {
	const { drawerWidth, mobileOpen, handleDrawerToggle } = props;

	const drawer = (
		<>
			<Toolbar />
			<List>
				<ListItem key={'roadmap'} disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<MapIcon />
						</ListItemIcon>
						<ListItemText primary="Roadmap" />
					</ListItemButton>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem key={'settings'} disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<SettingsIcon />
						</ListItemIcon>
						<ListItemText primary="Settings" />
					</ListItemButton>
				</ListItem>
			</List>
		</>
	);

	return (
		<Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{ keepMounted: true }}
				sx={{ display: { xs: 'block', sm: 'none' } }}>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{ display: { xs: 'none', sm: 'block' } }}
				open>
				{drawer}
			</Drawer>
		</Box>
	);
}
