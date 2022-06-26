import {
  CircularProgress,
  Paper,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { ModuleInfoContext } from "../../contexts";
import SearchBar from "./SearchBar";

export default function ModuleInfo() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { modules, isLoaded } = useContext(ModuleInfoContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filterData = (mod) => {
    if (mod.moduleCode.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    if (mod.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    return false;
  };

  return (
    <Stack spacing={2} minWidth="100%">
      <Stack direction="row" justifyContent="space-between">
        <Paper sx={{ p: 1 }} elevation={3}>
          <TablePagination
            count={modules.filter(filterData).length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
          />
        </Paper>
        <SearchBar setSearchQuery={setSearchQuery} />
      </Stack>
      {isLoaded ? (
        modules
          .filter(filterData)
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((mod) => (
            <Paper key={mod.moduleCode} sx={{ p: 1 }} elevation={3}>
              <Typography variant="overline">{mod.faculty}</Typography>
              <Typography variant="h6">{mod.moduleCode}</Typography>
              <Typography variant="body1">
                {mod.title} ({mod.moduleCredit} MCs)
              </Typography>
              <Typography variant="body2">{mod.description}</Typography>
            </Paper>
          ))
      ) : (
        <CircularProgress sx={{ alignSelf: "center" }} />
      )}
    </Stack>
  );
}
