import * as React from 'react';
import { Card, CardActionArea, CardContent, Dialog, Skeleton, Typography, IconButton, Stack } from "@mui/material";
import { ModuleInfoContext } from "../../contexts";
import CloseIcon from '@mui/icons-material/Close';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function ModuleBox(props) {
  const { moduleCode, index } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function getStyle(style, snapshot) {
    if (!snapshot.isDropAnimating) {
      return style;
    }
    const { moveTo } = snapshot.dropAnimation;
    // move to the right spot
    const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
  
    // patching the existing style
    return {
      ...style,
      transform: `${translate}`,
      // slowing down the drop because we can
      transition: `all ${0.2}s`,
    };
  }


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
        <Draggable draggableId={moduleCode} index={index} key={moduleCode}>
        {(provided, snapshot) => (
            <Card ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getStyle(provided.draggableProps.style, snapshot)}>
                <CardContent sx={{ width: 340, height: 90 }} onClick={handleClickOpen}>
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
            </Card>
          )}
        </Draggable>
        <Dialog onClose={handleClose} open={open} maxWidth = 'lg'>
          <Card sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 0,
              width: 'fit-content',
              padding: 2,
            }}>
            <IconButton sx={{ position: "absolute", top: 8, right: 8, zIndex: 2000}} onClick = {handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography position = "relative" bottom = '10%' variant="body2">
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
