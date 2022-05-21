import { Divider } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import Roadmap from './Roadmap';
import Settings from './Settings';
import Login from './Login';

const pages = [
	{
		isDrawerItem: true,
		key: 'roadmap',
		path: '/roadmap',
		icon: <MapIcon />,
		title: 'Roadmap',
		content: <Roadmap />,
	},
	{
		isDrawerAccessory: true,
		content: <Divider />,
	},
	{
		isDrawerItem: true,
		key: 'settings',
		path: '/settings',
		icon: <SettingsIcon />,
		title: 'Settings',
		content: <Settings />,
	},
	{
		path: '/login',
		content: <Login />,
	},
];

export default pages;
