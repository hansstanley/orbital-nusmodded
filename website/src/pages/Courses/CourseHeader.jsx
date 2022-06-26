import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import AddCourseButton from "./AddCourseButton";
import { columns } from "./constants";

export default function CourseHeader({
  handleSort = (sortBy) => {},
  handleSearch = (searchBy) => {},
}) {
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    handleSort(sortBy);
  }, [sortBy, handleSort]);

  useEffect(() => {
    handleSearch(search.toLowerCase());
  }, [search, handleSearch]);

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField label="Search" size="small" onChange={handleSearchChange} />
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Sort by</InputLabel>
        <Select value={sortBy} label="Sort by" onChange={handleSortByChange}>
          <MenuItem value="None">None</MenuItem>
          {columns.map((col) =>
            col.isSort ? (
              <MenuItem key={col.id} value={col.id}>
                {col.label}
              </MenuItem>
            ) : null
          )}
        </Select>
      </FormControl>
      <Box sx={{ flex: 1 }} />
      <AddCourseButton />
    </Stack>
  );
}
