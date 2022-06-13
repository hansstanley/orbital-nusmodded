import * as React from 'react';
import {
  InputAdornment,
  IconButton,
  Button,
  Card,
  Dialog,
  TextField,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { ModuleInfoContext } from "../../contexts";

function SimpleDialog(props) {
  const { onClose, selectedValue, open, courses, setCourses} = props;
  const [newCourse, setNewCourse] = React.useState("");

  const handleClose = () => {
    onClose(selectedValue);
  };

  function handleAddCourse() {
    const newCourses = [
      ...courses,
      {
        name: newCourse,
        modules: [],
      }
    ];
    setCourses(newCourses);
    handleClose();
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
        <TextField
          id="search-bar"
          className="text"
          onInput={(e) => {
            setNewCourse(e.target.value);
          }}
          label="Add Course"
          variant="outlined"
          placeholder="Course Name"
          size="medium"
          InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton onClick = {handleAddCourse}>
                <AddIcon />
              </IconButton>
            </InputAdornment>
            )
          }}
          />
      </Card>
    </Dialog>
  );
}

export default function SimpleDialogDemo({courses, setCourses}) {
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
        Add Course
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        courses = {courses}
        setCourses = {setCourses}
      />
    </>
  );
}