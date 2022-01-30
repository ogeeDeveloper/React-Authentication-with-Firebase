import { createContext, useState, useEffect, useCallback } from "react";

let logOutTimer;

const AuthContext = createContext({
  token: "",
  isLogIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateTime = (expirationTime) => {
  //Gets time in milliseconds
  const currentTime = new Date().getTime();

  //Adjust expirationTime from string to Date
  const AdjExpirationTime = new Date(expirationTime);

  const remainingDuration = AdjExpirationTime - currentTime;
  return remainingDuration;
};

// Retrieve the store token from localStorage
const retrieveStoredToken = () => {
  // Retrieve token stored in storage
  const storedToken = localStorage.getItem("access_token");
  // Retrieve expiration date stored in storage
  const storedExpirationTime = localStorage.getItem("Expiration_Time");

  // Get remaining time, and if its less than one minute it wont be valid
  const remainingTime = calculateTime(storedExpirationTime);
  if (remainingTime <= 60000) {
    //Remove token and Remaining time
    localStorage.removeItem("access_token");
    localStorage.removeItem("Expiration_Time");
    // Then dont login user
    return null;
  }

  // Else return the stored token and log inn user
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  //Checking if toke exist in localStorage, if exist autenticate user
  const tokenData = retrieveStoredToken();
  let initialToken;

  // Only retrieve token if token is truthy
  if (tokenData) {
    initialToken = tokenData.token;
  }

  //State for managing the token
  const [token, setToken] = useState(initialToken);

  //Check if user is logged in
  const userIsLoggedIn = !!token;

  // Logout Helper Function
  const logoutHandler = useCallback(() => {
    setToken(null);
    // Removes the token from the browser storage
    localStorage.removeItem("access_token");

    // Removes expiration time from browser storage
    localStorage.removeItem("Expiration_Time");

    //LogOut user if a timeout was set
    if (logOutTimer) {
      clearTimeout(logOutTimer);
    }
  }, []);

  // Login Handler Function
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    // Storing token in localstorage
    localStorage.setItem("access_token", token);

    //Store te expiration Time
    localStorage.setItem("Expiration_Time", expirationTime);

    // Calculate expiratio time of token
    const remainingTime = calculateTime(expirationTime);

    //Automatically logout users we remaining time expires
    logOutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logOutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]); // Add thhe logOutandler because we are using it useEffect

  // Create the ContextValue object to hold all values that will be used for the context
  // set all the values in the AuthContext in this function
  const contextValue = {
    token,
    isLogIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
