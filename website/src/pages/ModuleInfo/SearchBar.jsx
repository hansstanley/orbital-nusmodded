import { useState } from "react";
import {
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({setSearchQuery}) => (
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
      <InputAdornment>
        <IconButton>
          <SearchIcon />
        </IconButton>
      </InputAdornment>
      )
    }}
    />
);

export default function search({ setSearchQuery }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 20
      }}
    >
      <SearchBar setSearchQuery={setSearchQuery}/>
    </div>
  );
}