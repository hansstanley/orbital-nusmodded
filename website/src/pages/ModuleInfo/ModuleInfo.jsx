import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { ModuleInfoContext } from "../../contexts";

export default function ModuleInfo() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { modules, isLoaded } = useContext(ModuleInfoContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={2}>
      <Paper sx={{ position: "fixed", p: 1 }} elevation={3}>
        <TablePagination
          count={modules.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      </Paper>
      <Box sx={{ minHeight: 64 }} />
      {isLoaded ? (
        modules
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
