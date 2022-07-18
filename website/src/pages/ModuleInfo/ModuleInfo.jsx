import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMod, useSnackbar } from "../../providers";
import SearchBar from "./SearchBar";
import { LoadingBar } from "../../components";

export default function ModuleInfo() {
  const { getModArray } = useMod();
  const { pushSnack } = useSnackbar();
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerpage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const arr = await getModArray();
        setMods(arr);
      } catch (error) {
        setMods([]);
        console.error(error);
        pushSnack({
          message: "Unable to load modules :(",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [getModArray, pushSnack]);

  const filteredMods = useMemo(
    () =>
      mods.filter((mod) => {
        const { moduleCode, title } = mod;

        if (moduleCode.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        } else if (title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      }),
    [mods, searchQuery]
  );

  const sortedMods = useMemo(
    () =>
      filteredMods.sort((mod1, mod2) =>
        mod1.moduleCode < mod2.moduleCode ? -1 : 1
      ),
    [filteredMods]
  );

  const visibleMods = useMemo(
    () =>
      sortedMods.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedMods, page, rowsPerPage]
  );

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerpage(parseInt(event.target.value, 10));
  };

  const handleSearch = (value) => {
    setPage(0);
    setSearchQuery(value);
  };

  const handleOpen = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  const BarPlaceholder = () => (
    <Box sx={{ minHeight: barRef?.current?.clientHeight || 0 }} />
  );

  return (
    <Stack spacing={1}>
      <Paper
        ref={barRef}
        sx={{ position: "absolute", zIndex: "fab" }}
        elevation={3}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          p={1}
          alignItems="center"
        >
          <SearchBar handleSearch={handleSearch} />
          <TablePagination
            component="div"
            count={filteredMods.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
          />
        </Stack>
        <LoadingBar loading={loading} isRounded />
      </Paper>
      <BarPlaceholder />
      <Stack>
        {loading
          ? null
          : visibleMods.map((mod) => (
              <ModuleAccordion
                key={mod.moduleCode}
                moduleCode={mod.moduleCode}
                expanded={expanded === mod.moduleCode}
                onChange={handleOpen(mod.moduleCode)}
              />
            ))}
      </Stack>
      <Divider />
    </Stack>
  );
}

function ModuleAccordion({
  moduleCode,
  expanded = false,
  onChange = (event, isExpanded) => {},
}) {
  const { getModInfo } = useMod();
  const [mod, setMod] = useState(null);

  useEffect(() => {
    async function init() {
      const info = await getModInfo(moduleCode);
      setMod(info);
    }

    if (moduleCode) init();
  }, [moduleCode, getModInfo]);

  return (
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: "bold" }}>
              {mod ? moduleCode : <Skeleton />}
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography>{mod ? mod.title : <Skeleton />}</Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <Chip label={mod ? `${mod.moduleCredit} MC` : null} />
            <Chip label={mod ? mod.faculty : null} />
          </Stack>
          <Typography>{mod ? mod.description : <Skeleton />}</Typography>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
