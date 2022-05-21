import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';

export default function SearchBox() {
	return (
		<TextField
			variant="standard"
			placeholder="Search"
			size="small"
			color="primary"
			sx={{ mr: 2 }}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon />
					</InputAdornment>
				),
			}}
		/>
	);
}
