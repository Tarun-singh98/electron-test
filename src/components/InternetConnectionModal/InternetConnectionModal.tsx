import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";
const InternetConnectionModal = ({ isOpen, onClose, onRetry }: any) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius:1,
         
        }}
      >
        <Typography sx={{ color: "#FF2424" }}>
          No Internet Connection
        </Typography>
        <Typography>
          Please check your internet connection and try again.
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: "#FF2424",
              color: "white",
              ":hover": { backgroundColor: "#FF2424" },
            }}
          >
            Retry
          </Button>
          {/* <Button onClick={onRetry}>Retry</Button> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default InternetConnectionModal;
