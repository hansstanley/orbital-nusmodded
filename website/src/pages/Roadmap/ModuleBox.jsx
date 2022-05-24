import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import { ModuleInfoContext } from "../../contexts";

export default function ModuleBox(props) {
  const { moduleCode } = props;

  const generateContent = (moduleMap, isLoaded) => {
    const moduleInfo = isLoaded
      ? moduleMap.get(moduleCode)
      : {
          moduleCredit: <Skeleton />,
          moduleCode: <Skeleton />,
          title: <Skeleton />,
        };
    return moduleInfo ? (
      <Card sx={{ minWidth: 240 }}>
        <CardContent>
          <Typography variant="caption">
            {moduleInfo.moduleCredit} MC
          </Typography>
          <Typography variant="subtitle1">{moduleInfo.moduleCode}</Typography>
          <Typography variant="body2">{moduleInfo.title}</Typography>
        </CardContent>
      </Card>
    ) : null;
  };

  return (
    <ModuleInfoContext.Consumer>
      {({ moduleMap, isLoaded }) => generateContent(moduleMap, isLoaded)}
    </ModuleInfoContext.Consumer>
  );
}
