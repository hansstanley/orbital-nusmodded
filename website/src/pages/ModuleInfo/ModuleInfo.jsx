import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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
import LaunchIcon from "@mui/icons-material/Launch";
import { useMod, useRoadmap, useSnackbar } from "../../providers";
import SearchBar from "./SearchBar";
import { LoadingBar } from "../../components";
import { NUSMODS, ROADMAP } from "../../utils/constants";

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
  const { getAllMods, getSemesterById, setModulesById } = useRoadmap();
  const { pushSnack } = useSnackbar();
  const [mod, setMod] = useState(null);

  useEffect(() => {
    async function init() {
      const info = await getModInfo(moduleCode);
      setMod(info);
    }

    if (moduleCode) init();
  }, [moduleCode, getModInfo]);

  const handleAddMod = () => {
    if (getAllMods().includes(moduleCode)) {
      pushSnack({
        message: `${moduleCode} is already in the roadmap.`,
        severity: "warning",
      });
      return;
    }

    const myMods = getSemesterById(ROADMAP.MY_MODS_ID)?.modules || [];
    setModulesById(ROADMAP.MY_MODS_ID, myMods.concat([moduleCode]));
    pushSnack({
      message: `${moduleCode} has been added to My Modules!`,
      severity: "success",
    });
  };

  const nusmodsUrl = `${NUSMODS.MOD_PAGE_URL}/${moduleCode}`;

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
          <Divider />
          <Typography>{mod ? mod.description || "This module does not have a description" : <Skeleton />}</Typography>
          <Divider />
          <Stack direction="row" spacing={1}>
          {mod ? mod.prerequisite ? "Prerequisites: " + mod.prerequisite : "No prerequisites" : null}
          </Stack>
          <Divider />
          <Stack direction="row" spacing={1}>
            <Typography position={"relative"} top={3}>{mod ? mod.preclusion.length !== 0  ? "Preclusions: " : null : null}</Typography>
            {mod ? mod.preclusion.length !== 0  ? mod.preclusion.map(mod => <Chip label={mod} />) : "No preclusions" : null}
          </Stack>
          <Divider />
        </Stack>
      </AccordionDetails>
      <AccordionActions>
        <Stack direction="row" spacing={1}>
          <Button onClick={handleAddMod}>Add to roadmap</Button>
          <a
            href={nusmodsUrl}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button variant="outlined" endIcon={<LaunchIcon />}>
              NUSMods page
            </Button>
          </a>
        </Stack>
      </AccordionActions>
    </Accordion>
  );
}
