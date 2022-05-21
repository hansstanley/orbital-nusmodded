import React from 'react';
import {
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
					if (page.isDrawerAccessory) {
						return page.content;
					} else if (page.isDrawerItem) {
						return (
							<ListItem key={page.key} disablePadding>
								<ListItemButton
									onClick={() => {
										navigate(page.path);
										handleDrawerToggle();
									}}>
									<ListItemIcon>{page.icon}</ListItemIcon>
									<ListItemText primary={page.title} />
								</ListItemButton>
							</ListItem>
						);
					}
					return null;
				})}
			</List>
		</>
	);

	return (
		<>
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{ keepMounted: true }}
				sx={{
					display: { xs: 'block', sm: 'none' },
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', sm: 'block' },
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				open>
				{drawer}
			</Drawer>
		</>
	);
}
