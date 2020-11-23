import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "../components/firebase";
const LoadingScreen = (props) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        props.navigation.navigate("HomeStaks");
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default LoadingScreen;
