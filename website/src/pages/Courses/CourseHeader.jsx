import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useSnackbar } from "../../providers";
import { columns } from "./constants";

export default function CourseHeader() {
  const { pushSnack } = useSnackbar();
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
    pushSnack({
      message: `Sorting by ${event.target.value} (does not yet work)`,
      severity: "warning",
    });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    pushSnack({
      message: `Searching by ${event.target.value} (does not yet work)`,
      severity: "warning",
    });
  };

  const handleAddCourse = () => {
    pushSnack({
      message: "Open AddCourseDialog",
      severity: "warning",
    });
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField label="Search" size="small" onChange={handleSearchChange} />
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Sort by</InputLabel>
        <Select value={sortBy} label="Sort by" onChange={handleSortByChange}>
          <MenuItem value="">None</MenuItem>
          {columns.map((col) => (
            <MenuItem value={col.id}>{col.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ flex: 1 }} />
      <Button variant="outlined" onClick={handleAddCourse}>
        Add course
      </Button>
    </Stack>
  );
}
