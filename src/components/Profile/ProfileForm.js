import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const userNewPasswordRef = useRef();

  const history = useHistory();

  const submitNewPasswordHandle = (event) => {
    event.preventDefault();

    // Extract password from ref that users have provided
    const newPassword = userNewPasswordRef.current.value;

    //TODO: Add Validations

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCmrboXaN6nI0e9r_gT_HTwvrkNEuwwQJU",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: newPassword,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Problem changing your password";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
              throw new Error(errorMessage);
            }
          });
        }
      })
      .then((data) => {
        console.log(data);
        history.replace("/");
      })
      .catch((error) => {
        // If we have error,
        alert(error.message);
      });
    console.log(newPassword);
  };

  return (
    <form className={classes.form} onSubmit={submitNewPasswordHandle}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={userNewPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
