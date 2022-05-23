import { CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { ModuleInfoContext } from "../../contexts";

export default function ModuleInfo() {
  const limit = 100;

  return (
    <ModuleInfoContext.Consumer>
      {({ modules, isLoaded }) => (
        <Stack spacing={2}>
          <Typography variant="caption">
            Showing only {limit} entries for performance:
          </Typography>
          {isLoaded ? (
            modules.slice(0, limit).map((mod) => (
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
      )}
    </ModuleInfoContext.Consumer>
  );
}
