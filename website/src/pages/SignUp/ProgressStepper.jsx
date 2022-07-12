import { useState } from "react";
import { Box, Button, Card, CardContent, StepContent } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AccountDetails from "./AccountDetails";
import CustomizeSettings from "./CustomizeSettings";
import WelcomePage from "./WelcomePage";

export default function ProgressStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const steps = [
    {
      label: "Account details",
      content: <AccountDetails handleNext={handleNext} />,
    },
    {
      label: "Customise settings",
      content: <CustomizeSettings handleNext={handleNext} />,
    },
    {
      label: "Done!",
      content: <WelcomePage />,
    },
  ];

  return (
    <Box sx={{ flex: 1, pl: 1 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(({ label, content }, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
            <StepContent sx={{ flex: 1 }}>
              <Card>
                <CardContent
                  sx={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "auto",
                  }}
                >
                  {content}
                </CardContent>
              </Card>
              {/* <Button
                onClick={handleNext}
                disabled={index === steps.length - 1}
              >
                Next
              </Button>
              <Button
                onClick={() => setActiveStep((prev) => prev - 1)}
                disabled={index === 0}
              >
                Back
              </Button> */}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
