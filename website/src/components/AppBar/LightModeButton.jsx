import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { LightModeContext } from '../../contexts';

export default function LightModeButton() {
	return (
		<LightModeContext.Consumer>
			{({ isLightMode, toggleLightMode }) => (
				<IconButton onClick={toggleLightMode} sx={{ ml: 1 }}>
					{isLightMode ? <Brightness4Icon /> : <Brightness7Icon />}
				</IconButton>
			)}
		</LightModeContext.Consumer>
	);
}
