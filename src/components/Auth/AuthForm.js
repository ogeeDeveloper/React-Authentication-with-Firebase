import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    // Extract data from form
    const userEnteredEmail = emailInputRef.current.value;
    const userEnteredPasswword = passwordInputRef.current.value;

    // TODO: Add validations

    setIsLoading(true);
    //Checks if mode is login else do the login logics
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCmrboXaN6nI0e9r_gT_HTwvrkNEuwwQJU";
    } else {
      // else do logics for user signup
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCmrboXaN6nI0e9r_gT_HTwvrkNEuwwQJU";
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: userEnteredEmail,
        password: userEnteredPasswword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          // TODO: Seds back some information
          return res.json();
        } else {
          return res.json().then((data) => {
            // Show Error
            let errorMessage = "Your Authenticationn failed";

            // Checks if data have an
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // success status if we dont have any error
        console.log(data);
        // Set the token for the auth context
        authCtx.login(data.idToken);
        // Redirect Users to the Profile Page
        history.replace("/");

        console.log(authCtx.token);
      })
      .catch((error) => {
        // If we have error,
        alert(error.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Loading, please wait...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
