import React, { useState, useContext } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";

import CartItem from "./CartItem";
import Colors from "../constants/Colors";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../navigation/AuthProvider";

import * as orderActions from "../store/productActions";
import { useSelector, useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native";

const OrderItem = (props) => {
  const { orderQuantityUpdate, updateChecked, iconCheck } =
    useContext(AuthContext);

  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();
  const id = props.id;
  const refresh = props.reload;
  const newCart = props.items;
  const [allSet, setAllSet] = useState(false);

  const checkyCheck = async (cartitem) => {
    cartitem.isChecked = true;
    if (newCart.find((boo) => boo.isChecked === false)) {
      // console.log("ahhh we got sumn false");
      newCart.checked = false;

      setAllSet(true);
    } else {
      // console.log("we just might be gucci");
      newCart.checked = true;
      iconCheck(id).then(() => {
        refresh();
      });
    }
    // console.log("all chcek", cartitem);
    // console.log("final chcek", newCart);
    updateChecked(newCart, id).then(() => {
      refresh();
    });
  };

  return (
    <Card style={styles.orderItem}>
      <View
        style={{
          alignSelf: "flex-end",
          position: "absolute",
          right: -1,
          top: -15,
        }}
      >
        {!props.checked ? (
          <TouchableOpacity
            onPress={() => {
              setShowDetails((prevState) => !prevState);
            }}
          >
            <Ionicons name="alert-circle" size={29} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <Text></Text>
        )}
      </View>
      <View style={styles.summary}>
        {/* <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text> */}

        <Text style={styles.totalAmount}>${props.amount}</Text>

        <Text style={styles.date}>{props.date}</Text>
      </View>
      {/* <Text style={styles.time}>{props.time}</Text> */}
      <Button
        color={Colors.primary}
        title={showDetails ? "Ocultar" : "Detalles"}
        onPress={() => {
          setShowDetails((prevState) => !prevState);
        }}
      />
      {showDetails && (
        <View style={styles.detailItems}>
          {props.items.map((cartItem) => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              checkable={props.checkable}
              checked={cartItem.isChecked}
              title={cartItem.productTitle}
              dId={props.id}
              onCheck={() => {
                Alert.alert(
                  "Actualizar?",
                  `${cartItem.productTitle} se actualizará menos ${cartItem.quantity} de su inventario.`,
                  [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Si",
                      onPress: async () => {
                        console.log("updating quantity test");
                        orderQuantityUpdate(cartItem);

                        checkyCheck(cartItem);
                        // console.log("checky check", cartItem.isChecked);

                        // await dispatch(
                        //   orderActions.updateChecked(cartItem, id)
                        // ).then(() => {
                        //   refresh();
                        // });
                      },
                    },
                  ]
                );
              }}
            />
          ))}
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "silver" }}>Pedido id: {id}</Text>
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    marginTop: 15,
  },
  totalAmount: {
    // fontFamily: "open-sans-bold",
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 16,
    // fontFamily: "open-sans",
    color: "#888",
  },
  time: {
    fontSize: 13,
    // fontFamily: "open-sans",
    color: "#888",
  },
  detailItems: {
    width: "100%",
  },
});

export default OrderItem;
