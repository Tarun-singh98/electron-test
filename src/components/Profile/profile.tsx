import { useContext, useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { UserContext } from "@/Store/Context/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
// import { ipcRenderer } from "electron";
const {ipcRenderer}: any = window;
const Profile = () => {
  const userCTX: any = useContext(UserContext);
  const [name, setName] = useState(userCTX.userDetails?.name);
  const [email, setEmail] = useState(userCTX.userDetails?.email);
  const [phone, SetPhone] = useState(userCTX.userDetails?.phoneNumber);
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState("+91");
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);
  const restart = async () => {
    try {
      await ipcRenderer.appRestart();
    }catch(error){
      console.log(error, 'error');
    }
  }
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    restart();
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
            backgroundColor: "#FAFBFD"
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              width: "60%",
              // marginTop: 5,
              gap: 4,
              // border: "1px solid #4470AD",
              borderRadius: "6px",
              paddingX: "50px",
              paddingY: "40px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Typography sx={{ color: "#555555", fontSize: "16px", fontWeight: 500 }}>
                Name:
              </Typography>
              <TextField
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled
                variant="standard"
                inputProps={{
                  style: {
                    fontSize: "15px",
                    color: "#000000",
                    fontWeight: 500
                  },
                }}
                style={{
                  width: "90%",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Typography sx={{ color: "#555555", fontSize: "16px", fontWeight: 500 }}>
                Email:
              </Typography>
              <TextField
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                variant="standard"
                inputProps={{
                  style: {
                    fontSize: "15px",
                    color: "#000000",
                    fontWeight: 500
                  },
                }}
                style={{
                  width: "90%",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "#555555",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "70%",
                    fontSize: "16px",
                    fontWeight: 500
                  }}
                >
                  Country Code:
                </Typography>
                <TextField
                  placeholder="Enter your mobile"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled
                  variant="standard"
                  inputProps={{
                    style: {
                      fontSize: "15px",
                      color: "#000000",
                      fontWeight: 500
                    },
                  }}
                  style={{
                    width: "60%",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "#555555",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "90%",
                    fontSize: "16px",
                    fontWeight: 500
                  }}
                >
                  Mobile:
                </Typography>
                <TextField
                  placeholder="Enter your mobile"
                  value={phone}
                  onChange={(e) => SetPhone(e.target.value)}
                  disabled
                  variant="standard"
                  inputProps={{
                    style: {
                      fontSize: "15px",
                      color: "#000000",
                      fontWeight: 500
                    },
                  }}
                  style={{
                    width: "80%",
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Button
            sx={{
              fontSize: "14px",
              width: "30%",
              color: "white",
              borderRadius: 2,
              ":hover": { backgroundColor: "#4470AD", color: "white" },
              backgroundColor: "#4470AD",
              marginTop: 8,
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Profile;
