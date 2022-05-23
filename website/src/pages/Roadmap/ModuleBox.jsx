import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { ModuleInfoContext } from "../../contexts";
import { ModuleInfoProvider } from "../../providers";

export default function ModuleBox(props) {
  const { moduleCode } = props;

  const generateContent = (moduleMap) => {
    const moduleInfo = moduleMap.get(moduleCode);
    return moduleInfo ? (
      <Card sx={{ minWidth: 240 }}>
        <CardContent>
          <Typography variant="caption">{moduleInfo.moduleCredit}MC</Typography>
          <Typography variant="subtitle1">{moduleInfo.moduleCode}</Typography>
          <Typography variant="body2">{moduleInfo.title}</Typography>
        </CardContent>
      </Card>
    ) : null;
  };

  return (
    <ModuleInfoContext.Consumer>
      {({ moduleMap, isLoaded }) =>
        isLoaded ? (
          generateContent(moduleMap)
        ) : (
          <CircularProgress sx={{ alignSelf: "center" }} />
        )
      }
    </ModuleInfoContext.Consumer>
  );
}
