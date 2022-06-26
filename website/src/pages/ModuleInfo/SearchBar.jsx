import { IconButton, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setSearchQuery, handleSearch }) => (
  <TextField
    id="search-bar"
    className="text"
    onInput={(e) => {
      setSearchQuery(e.target.value);
    }}
    label="Search Modules"
    variant="outlined"
    placeholder="Search..."
    size="small"
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton>
            <SearchIcon onClick={handleSearch} />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

export default function search({ setSearchQuery, handleSearch }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
    </div>
  );
}
