import { Box, Typography } from '@mui/material'
import React from 'react'

const Subscription = () => {
  return (
    // <div>Subscription</div>
    <Box
    sx={{
        width: "100%",
        height: "96%",
        backgroundColor: "#FFFFFF",
        marginTop: "-20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
        <Box
        sx={{
            width:"90%",
            backgroundColor:"white",
            marginTop:"5%"
        }}
        >
            <Typography>Hello</Typography>
        </Box>
    </Box>
  )
}

export default Subscription