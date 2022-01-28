import { createContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  isLogIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  //State for managing the token
  const [token, setToken] = useState(null);

  //Check if user is logged in
  const userIsLoggedIn = !!token;

  // Login Helper Function
  const loginHandler = (token) => {
    setToken(token);
  };

  // Logout Helper Function
  const logoutHandler = () => {
    setToken(false);
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
