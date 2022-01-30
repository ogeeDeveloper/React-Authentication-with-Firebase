import { createContext, useState } from "react";

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

export const AuthContextProvider = (props) => {
  //Checking if toke exist in localStorage, if exist autenticate user
  const initialToken = localStorage.getItem("access_token");

  //State for managing the token
  const [token, setToken] = useState(initialToken);

  //Check if user is logged in
  const userIsLoggedIn = !!token;

  // Logout Helper Function
  const logoutHandler = () => {
    setToken(false);
    // Removes the token from the browser storage
    localStorage.removeItem("access_token");
  };

  // Login Handler Function
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    // Storing token in localstorage
    localStorage.setItem("access_token", token);

    // Calculate expiratio time of token
    const remainingTime = calculateTime(expirationTime);

    //Automatically logout users we remaining time expires
    setTimeout(logoutHandler, remainingTime);
  };

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
