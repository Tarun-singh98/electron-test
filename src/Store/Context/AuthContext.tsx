import { createContext, useState } from "react";
export const AuthContext = createContext({
    loading: true,
    token: {},
    isTokenValid: {},
    isTallyOpen: {},
    isInternetConnected: {},
    isServerUp: {},
    updateLoading: (value: any) => { },
    updateToken: (value: any) => { },
    updateTokenValidity: (value: any) => { },
    updateTallyOpenStatus: (value: any) => { },
    updateInternetStatus: (value: any) => { },
    updateServerStatus: (value: any) => { }
});

function AuthContextProvider({ children }: any) {
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState({})
    const [isTokenValid, setIsTokenValid] = useState({})
    const [tallyOpened, setTallyOpened] = useState({});
    const [isInternetConnected, setIsInternetConnected] = useState({});
    const [isServerUp, setIsServerUp] = useState({})


    function updateLoading(value: any) {
        setLoading(value)
    }
    function updateToken(value:any) {
        setToken(value)
    }

    function updateTokenValidity(value:any) {
        setIsTokenValid(value)
    }

    function updateTallyOpenStatus(value: any) {
        setTallyOpened(value);
    }

    function updateInternetStatus(value: any) {
        setIsInternetConnected(value);
    }
    function updateServerStatus(value: any) {
        setIsServerUp(value)
    }

    const value = {
        loading: loading,
        token: token,
        isTokenValid: isTokenValid,
        isTallyOpen: tallyOpened,
        isInternetConnected: isInternetConnected,
        isServerUp:isServerUp,
        updateLoading:updateLoading,
        updateToken:updateToken,
        updateTokenValidity:updateTokenValidity,
        updateTallyOpenStatus: updateTallyOpenStatus,
        updateInternetStatus: updateInternetStatus,
        updateServerStatus:updateServerStatus

    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
