import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AccountDetails from "./AccountDetails";
import CustomizeSettings from "./CustomizeSettings";

const steps = ["Enter Account Details", "Customize Settings", "Done!"];

export default function ProgressStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={index} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {
        {
          0: <AccountDetails activeStep={activeStep} handleNext={handleNext} />,
          1: <CustomizeSettings />,
          2: <></>,
        }[activeStep]
      }
    </Box>
  );
}