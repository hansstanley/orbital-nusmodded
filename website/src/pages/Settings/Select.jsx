import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DurationContext } from "../../contexts";


export default function RadioButtonsGroup() {
  return (
    <DurationContext.Consumer>
      {({ duration, toggleDuration }) => (
      <FormControl>
        <FormLabel>Duration of Study</FormLabel>
        <RadioGroup
          value={duration}
          name="controlled-radio-buttons-group"
          onChange={(e) => toggleDuration(e)}
        >
          <FormControlLabel value="threeYears" control={<Radio />} label="3 Years" />
          <FormControlLabel value="fourYears" control={<Radio />} label="4 Years" />
        </RadioGroup>
      </FormControl>
      )}
    </DurationContext.Consumer>
  );
}