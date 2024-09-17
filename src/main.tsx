import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./samples/node-api";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthContextProvider from "./Store/Context/AuthContext";
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: 16, // Adjust the default font size here
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Add any custom button styles here to prevent theme changes from affecting them
          // borderRadius: 8, // For example, you can set a fixed border radius
        },
      },
    },
    // Add more component overrides as needed
  },
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
