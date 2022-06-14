import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AccountDetails from './AcccountDetails';
import CustomizeSettings from './CustomizeSettings';

const steps = ['Enter Account Details', 'Customize Settings', 'Done!'];

export default function ProgressStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 0 ? (
        <AccountDetails activeStep = {activeStep} setActiveStep = {setActiveStep}/>
      ) : activeStep === 1 ? (
        <CustomizeSettings />
      ) : (
        <></>
      )}
    </Box>
  );
}
