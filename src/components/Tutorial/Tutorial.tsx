import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import * as Icons from "@mui/icons-material";

const customIcon = (iconName: any) => {
  return <Box sx={{ display: "flex", alignItems: "center" }}>{iconName}</Box>;
};

function Tutorial() {
  const [loading, setLoading] = useState(false);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "96%",
        marginTop: "-20px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%", // Center loader vertically
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            margin: 1,
          }}
        >
          <Box sx={{ width: "100%", height: "100%" }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "white",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Step 1" {...a11yProps(0)} />
                <Tab label="Step 2" {...a11yProps(1)} />
                {/* <Tab label="Step 3" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Box
                sx={{
                  border: 1,
                  borderRadius: 1,
                  p: 1,
                  borderColor: "lightgrey",
                }}
              >
                <Typography>
                  1. Ensure tally is opened and settings in tally are as
                  follows:
                </Typography>
                <Typography>
                  {"  ("}
                  Help{" -> "}Settings{" -> "}
                  Connectivity{" -> "}
                  Client/Server Configuration
                  {")"}
                </Typography>
                <Typography>TallyPrime acts as : Both</Typography>
                <Typography>Enable ODBC {"       "}: Yes</Typography>
                <Typography>
                  Port : {"<"}Your desired port{">"}
                </Typography>
              </Box>
              <Box
                sx={{
                  border: 1,
                  borderRadius: 1,
                  p: 1,
                  borderColor: "lightgrey",
                  mt: 1,
                }}
              >
                <Typography>
                  2. Ensure that the port set in Tally {"("}Above step{")"} and
                  the port in connector {"("}Settings {"->"} Tally Port are same
                  {")"}
                </Typography>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                <Box
                  sx={{
                    border: 1,
                    borderRadius: 1,
                    p: 1,
                    borderColor: "lightgrey",
                  }}
                >
                  <Typography>
                    1. To Sync your company, go to "Add Company" page from the
                    sidebar and click on "Sync" for your desired company
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>
                    The Sync will take about 30-40 minutes to complete.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: 1,
                    borderRadius: 1,
                    p: 1,
                    borderColor: "lightgrey",
                  }}
                >
                  <Typography>
                    2. After the compazny is synced, your synced company will
                    start appearing on companies page.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: 1,
                    borderRadius: 1,
                    p: 1,
                    borderColor: "lightgrey",
                  }}
                >
                  <Typography>
                    3. Synced company will get auto Synced every 10 minutes. To
                    change the sync interval, go to "Settings" and change the
                    Sync frequency to your desired value.
                  </Typography>
                </Box>
              </Box>
            </CustomTabPanel>
            {/* <CustomTabPanel value={value} index={2}>
              Item Three
            </CustomTabPanel> */}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Tutorial;
