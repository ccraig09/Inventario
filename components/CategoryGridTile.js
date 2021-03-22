import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
} from "react-native";

const CategoryGridTile = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <View style={styles.gridItem}>
      <TouchableCmp style={{ flex: 1 }} onPress={props.onSelect}>
        <View
          style={{ ...styles.container, ...{ backgroundColor: props.color } }}
        >
          <Text style={styles.title} numberOfLines={2}>
            {props.title}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {props.price} bs
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {props.category}
          </Text>
        </View>
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    backgroundColor: "#FF4949",
    margin: 15,
    width: 150,
    height: 150,
    borderRadius: 10,
    shadowColor: "#FF4949",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 9.84,
    overflow:
      Platform.OS === "android" && Platform.Version >= 21
        ? "hidden"
        : "visible",
    elevation: 10,
  },
  container: {
    flex: 1,
    borderRadius: 10,
    // shadowColor: "black",
    // shadowOpacity: 0.26,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 10,
    padding: 15,
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    // fontFamily: "open-sansr-bold",
    fontSize: 21,

    // textAlign: "right",
  },
});

export default CategoryGridTile;
