import { Divider } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import Roadmap from './Roadmap';
import Settings from './Settings';

const pages = [
	{
		key: 'roadmap',
		path: '/roadmap',
		icon: <MapIcon />,
		title: 'Roadmap',
		content: <Roadmap />,
	},
	{
		isDivider: true,
		content: <Divider />,
	},
	{
		key: 'settings',
		path: '/settings',
		icon: <SettingsIcon />,
		title: 'Settings',
		content: <Settings />,
	},
];

export default pages;
