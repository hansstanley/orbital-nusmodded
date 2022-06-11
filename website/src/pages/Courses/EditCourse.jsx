import * as React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  DialogTitle,
  Dialog,
  CircularProgress,
  Typography,
  Autocomplete,
  TextField,
  Card,
  InputAdornment,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { ModuleInfoContext } from "../../contexts";

function SimpleDialog(props) {
  const { onClose, selectedValue, open, course, courses, setCourses, updateMCs} = props;
  const { modules, isLoaded } = React.useContext(ModuleInfoContext);
  const [addModule, setAddModule] = React.useState("");

  React.useEffect(() => {
    if (course){
      updateMCs(course.name);
    }
}, [course]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleAdd = () => {
    if (course.modules.indexOf(addModule) === -1){
      const updatedCourse = {name: course.name, modules: [...course.modules, addModule]};
      const updatedCourses = courses.map(c => c.name === course.name ? updatedCourse : c);
      setCourses(updatedCourses, () => updateMCs(course.name));
    }
  }

  const handleDelete = (modName) => {
    const updatedCourse = {name: course.name, modules: course.modules.filter(mod => mod !== modName)};
    const updatedCourses = courses.map(c => c.name === course.name ? updatedCourse : c);
    setCourses(updatedCourses, () => updateMCs(course.name));
  }

  return (
      <Dialog onClose={handleClose} open={open}>
        <Card sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 0,
              width: 'fit-content',
              height: 'auto',
              padding: 2,
            }}>
        <DialogTitle>Add Modules</DialogTitle>
        <Autocomplete
          freeSolo
          selectOnFocus
          clearOnBlur 
          options={modules.map(mod => mod.moduleCode)}
          sx={{ width: 300 }}
          renderInput={(params) => 
          <TextField {...params}
            label="Modules" 
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <AddIcon onClick = {handleAdd}/>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />}
          onChange={(event, newValue) => {
            setAddModule(newValue);
          }}
        />
        <List dense={true}>
          {isLoaded ? (
              !course ? null :
              !course.modules ? null : course.modules
                .map((modName) => modules.find(mod => mod.moduleCode === modName))
                .map((mod) => (
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon onClick = {() => handleDelete(mod.moduleCode)}/>
                      </IconButton>
                    }
                  >
                  <ListItemAvatar>
                    <Avatar>
                      <AutoStoriesIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary = {mod.moduleCode} secondary={mod.title}>
                  </ListItemText>
                  </ListItem>
                ))
            ) : (
              <CircularProgress sx={{ alignSelf: "center" }} />
            )}
        </List>
        </Card>
      </Dialog>
  );
}

export default function SimpleDialogDemo({course, courses, setCourses, updateMCs}) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Edit Course
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        course = {course}
        courses = {courses}
        setCourses = {setCourses}
        updateMCs = {updateMCs}
      />
    </>
  );
}