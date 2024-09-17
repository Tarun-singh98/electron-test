import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  stepConnectorClasses,
  StepIconProps,
  Typography,
} from "@mui/material";
import { Check } from "@mui/icons-material";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#4470AD",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#4470AD",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#4470AD",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));
const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#4470AD",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      // color: "#784af4",
      color: "#ffffff",
      zIndex: 1,
      fontSize: 18,
      // backgroundColor: "#4470AD",
    },
    "& .QontoStepIcon-circle": {
      width: 15,
      height: 15,
      borderRadius: "50%",
      backgroundColor: "#4470AD",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <div
          style={{
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #4470AD",
            backgroundColor: "#4470AD",
          }}
        >
          <Check
            className="QontoStepIcon-completedIcon"
            style={{ width: "10px", height: "10px" }}
          />
        </div>
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const StepperComponent = ({ activeStep, steps }: any) => {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      connector={<QontoConnector />}
    >
      {steps.map((step: string, index: number) => (
        <Step key={index}>
          {/* Use the label provided in the step object */}
          <StepLabel StepIconComponent={QontoStepIcon}>
            <Typography
              style={{
                fontSize: 12,
                // whiteSpace: "pre-wrap",
                textAlign: "center",
              }}
            >
              {steps[index]}
            </Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StepperComponent;
