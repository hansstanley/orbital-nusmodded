import { useState } from "react";
import { Stack } from "@mui/material";
import CourseTable from "./CourseTable";
import CourseHeader from "./CourseHeader";

export default function Courses() {
  const [sortBy, setSortBy] = useState("");
  const [searchBy, setSearchBy] = useState("");

  const handleSort = (newSortBy = "") => {
    setSortBy(newSortBy);
  };

  const handleSearch = (newSearch = "") => {
    setSearchBy(newSearch);
  };

  return (
    <Stack spacing={2} minWidth="100%">
      <CourseHeader handleSort={handleSort} handleSearch={handleSearch} />
      <CourseTable sortBy={sortBy} searchBy={searchBy} />
    </Stack>
  );
}
