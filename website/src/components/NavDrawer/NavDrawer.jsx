import React from 'react';
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { pages } from '../../pages';

export default function NavDrawer(props) {
	const { drawerWidth, mobileOpen, handleDrawerToggle } = props;

	const navigate = useNavigate();

	const drawer = (
		<>
			<Toolbar />
			<List>
				{pages.map((page) => {
					if (page.isDivider) {
						return page.content;
					} else {
						return (
							<ListItem key={page.key} disablePadding>
								<ListItemButton
									onClick={() => navigate(page.path)}>
									<ListItemIcon>{page.icon}</ListItemIcon>
									<ListItemText primary={page.title} />
								</ListItemButton>
							</ListItem>
						);
					}
				})}
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
