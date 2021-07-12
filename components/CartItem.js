import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Audio } from "expo-av";

const CartItem = (props) => {
  let Container = props.addable ? TouchableOpacity : View;
  let totalQuantity = props.addable
    ? props.userProd.find((code) => code.productId === props.prodId)
    : "";
  let shownQuantity =
    typeof totalQuantity === "undefined" ? "?" : totalQuantity.productQuantity;
  const [maxReached, setMaxReached] = useState(false);
  const [oneTime, setOneTime] = useState(false);
  const [sound, setSound] = React.useState();

  if (shownQuantity === props.quantity && !oneTime) {
    setMaxReached(true);
  }
  if (maxReached) {
    async function playSound() {
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/max.mp3")
      );
      setSound(sound);

      console.log("Playing Sound");
      await sound.playAsync();
    }
    playSound();
    Alert.alert(
      "Maxixmo Cantidad!",
      "llegaste a tu maximo de este producto, proceda con precaución."
    );
    setMaxReached(false);
    setOneTime(true);
  }
  return (
    <View style={styles.cartItem}>
      <Container onPress={props.onAdd} style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity} </Text>
        {props.addable && (
          <Text style={styles.quantity}>/{shownQuantity} </Text>
        )}
        <Text style={styles.mainText}>{props.title}</Text>
      </Container>
      <View style={styles.itemData}>
        <Container onPress={props.onPriceEdit}>
          <Text style={styles.amount}>{props.amount}bs</Text>
        </Container>
        {/* <Text style={styles.amount}>${props.amount.toFixed(2)}</Text> */}
        {props.deletable && (
          <TouchableOpacity
            onLongPress={props.onLongRemove}
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
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    borderRadius: 15,
    marginVertical: 5,
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
