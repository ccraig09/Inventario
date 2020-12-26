import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "../components/firebase";
import * as ProdActions from "../store/productActions";

import { useDispatch } from "react-redux";

export const AUTHENTICATE = "AUTHENTICATE";

const LoadingScreen = (props) => {
  const dispatch = useDispatch();

  const authenticate = (userId, token) => {
    return (dispatch) => {
      // dispatch(setLogoutTimer(expiryTime));
      dispatch({ type: AUTHENTICATE, userId: userId });
    };
  };
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        fetchThings();
        var userId = user.uid.toString();
        // console.log("this is tkn", token);
        console.log("this is id on startup", userId);

        dispatch(authenticate(userId));
        async function fetchThings() {
          let response = await dispatch(ProdActions.fetchProducts());
        }

        props.navigation.navigate("HomeStax");
        console.log("pre loading products for homePage");
      } else {
        props.navigation.navigate("Auth");
      }
    });
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};
LoadingScreen.navigationOptions = (navData) => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default LoadingScreen;
