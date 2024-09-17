import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./CustomProgressBar.css";

const Loader = ({ percentage }: any) => {
  return (
    <Box
      width="55%"
      sx={{ textAlign: "right", display: "flex", flexDirection: "column" }}
    >
      <Typography
        variant="body2"
        color="#7D7D7D"
        fontSize= "12px"
      >{`${percentage}% completed`}</Typography>

      <div className="customProgressBar">
        <div
          className="progress"
          color="#007EDA"
          style={{ width: `${percentage}%`, backgroundColor: "#007EDA",color:"#007EDA" }}
        ></div>
      </div>

      <Typography
        sx={{ fontSize: "12px", textAlign: "right", color: "#007EDA" }}
      >
        syncing in progress.
      </Typography>
    </Box>
  );
};

export default Loader;
