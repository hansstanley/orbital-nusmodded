import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ handleSearch = (value) => {} }) {
  return (
    <TextField
      id="search-bar"
      className="text"
      onInput={(e) => handleSearch(e.target.value)}
      label="Search Modules"
      variant="outlined"
      placeholder="Search..."
      size="small"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
