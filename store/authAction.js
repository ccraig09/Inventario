export const LOGOUT = "LOGOUT";
import firebase from "../components/firebase";

export const logout = () => {
  // clearLogoutTimer();
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("signed out sucessfully");
      // Sign-out successful.
    })
    .catch(function (error) {
      console.log(error);
      // An error happened.
    });

  // AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};
