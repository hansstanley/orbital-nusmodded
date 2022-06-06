import * as React from 'react';
import { Card, CardActionArea, CardContent, Dialog, Skeleton, Typography } from "@mui/material";
import { ModuleInfoContext } from "../../contexts";


export default function ModuleBox(props) {
  const { moduleCode } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const generateContent = (moduleMap, isLoaded) => {
    const moduleInfo = isLoaded
      ? moduleMap.get(moduleCode)
      : {
          moduleCredit: <Skeleton />,
          moduleCode: <Skeleton />,
          title: <Skeleton />,
        };
    return moduleInfo ? (
      <>
        <Card>
          <CardActionArea onClick={handleClickOpen}>
            <CardContent sx={{ width: 340, height: 90 }}>
              <Typography variant="caption" position='relative' bottom='5%'>
                {moduleInfo.moduleCredit} MCs
              </Typography>
              <Typography variant="subtitle1" position='relative' bottom='5%'>
                {moduleInfo.moduleCode}
              </Typography>
              <Typography variant="body2" position='relative' bottom='10%' noWrap >
                {moduleInfo.title}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Dialog onClose={handleClose} open={open} maxWidth = 'lg'>
          <Card sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 0,
              width: 'fit-content',
              padding: 2,
            }}>
            <Typography variant="body2">
              {moduleInfo.department + ", " + moduleInfo.faculty}
            </Typography>
            <Typography variant="body">
              {moduleInfo.moduleCredit} MCs
            </Typography>
            <Typography variant="h4">
              {moduleInfo.moduleCode}
            </Typography>
            <Typography variant="h6">
              {moduleInfo.title}
            </Typography>
            <Typography variant="subtitle1">
                {moduleInfo.description !== "" ? moduleInfo.description : "This module does not have a module description."}
            </Typography>
          </Card>
        </Dialog>
      </>
    ) : null;
  };

  return (
    <ModuleInfoContext.Consumer>
      {({ moduleMap, isLoaded }) => generateContent(moduleMap, isLoaded)}
    </ModuleInfoContext.Consumer>
  );
}
