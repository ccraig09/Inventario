import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const CartItem = (props) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity}x </Text>
        <Text style={styles.mainText}>{props.title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.amount}>${props.amount}</Text>
        {/* <Text style={styles.amount}>${props.amount.toFixed(2)}</Text> */}
        {props.deletable && (
          <TouchableOpacity
            onPress={props.onRemove}
            style={styles.deleteButton}
          >
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
        {props.checkable && (
          <View style={styles.deleteButton}>
            {props.checked ? (
              <Ionicons
                name={"checkmark-circle"}
                size={25}
                color={Colors.primary}
              />
            ) : (
              <TouchableOpacity
                onPress={props.onCheck}
                style={styles.deleteButton}
              >
                <Ionicons
                  name={"checkmark-circle-outline"}
                  size={25}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flex:1,
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    borderRadius: 15,
    marginVertical: 3,
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    // fontFamily: "open-sans",
    color: "#888",
    fontSize: 16,
  },
  mainText: {
    // fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 20,
  },
});

export default CartItem;
