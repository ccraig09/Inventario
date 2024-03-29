import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import firebase from "../components/firebase";

import CartItem from "./CartItem";
import Colors from "../constants/Colors";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../navigation/AuthProvider";

import * as orderActions from "../store/productActions";
import { useSelector, useDispatch } from "react-redux";
import { TouchableOpacity } from "react-native";

const OrderItem = (props) => {
  const { user, orderQuantityUpdate, updateChecked, iconCheck, addMemProd } =
    useContext(AuthContext);
  const db = firebase.firestore().collection("Members");
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [yellowCheck, setYellowCheck] = useState(false);
  const [cartProps, setCartProps] = useState();
  const id = props.id;
  const refresh = props.reload;
  const newCart = props.items;
  const [allSet, setAllSet] = useState(false);

  const qUpdateHandler = async (cartItem) => {
    setIsLoading(true);
    console.log("check cartitem", cartItem);
    const subNum = cartItem.quantity;
    const Code = cartItem.productcode;
    const availableProducts = props.available.find(
      (cod) => cod.productcode === Code
    );
    const userProducts = props.userProducts.find(
      (cod) => cod.productcode === Code
    );

    if (typeof availableProducts === "undefined") {
      console.log("check these!", cartItem);

      Title = cartItem.productTitle;
      Price = cartItem.productPrice;
      Category = "";
      Size = "";
      Brand = "";
      Code;
      Alert.alert(
        "Product no esta registrado",
        "Este producto era vendido sin estar registrado, agregarlo ahora?",
        [
          {
            text: "Todavia",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Sí",
            onPress: () => {
              setIsLoading(true);
              addMemProd(Title, Price, Category, Size, Brand, Code),
                setIsLoading(false),
                refresh();
              Alert.alert(
                "Producto registrado",
                "Por favor revisa los datos del producto en tu inventario",
                [
                  {
                    text: "Listo",
                    // onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                ]
              );
            },
          },
        ]
      );

      // addMemProd(Title, Price, Category, Size, Brand, Code),
      setIsLoading(false);
      return;
    }

    const nonRegProduct = props.available.find(
      (cod) => cod.productcode !== Code
    );
    // console.log(availableProducts);
    const increment = firebase.firestore.FieldValue.increment(-subNum);
    let Title = availableProducts.productTitle;
    let Price = availableProducts.productPrice;
    let Category = availableProducts.productCategory;
    let Size = availableProducts.productSize;
    let Brand = availableProducts.productBrand;

    if (userProducts) {
      try {
        await db.doc(user.uid).collection("Member Products").doc(Code).update(
          {
            Quantity: increment,

            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          }
          // { merge: true }
        );
      } catch (err) {
        console.log(err.message);
      }
    }
    if (availableProducts && !userProducts) {
      console.log(
        "while completing order, this item is not part of user database"
      );
      Alert.alert(
        "Product no esta registrado",
        "Este producto era vendido sin estar registrado, agregarlo ahora?",
        [
          {
            text: "Todavia",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Sí",
            onPress: () => {
              setIsLoading(true);
              addMemProd(Title, Price, Category, Size, Brand, Code),
                setIsLoading(false),
                Alert.alert(
                  "Producto registrado",
                  "Por favor revisa los datos del producto en tu inventario",
                  [
                    {
                      text: "Listo",
                      // onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                  ]
                );
              refresh();
            },
          },
        ]
      );
    }

    setIsLoading(false);
  };

  const checkyCheck = async (cartItem) => {
    cartItem.isChecked = true;
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
    updateChecked(newCart, id);
    //   .then(() => {
    //   refresh();
    // });
  };
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={"red"} />
        <Text>Actualizando</Text>
      </View>
    );
  }

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
              pId={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              checkable={props.checkable}
              checked={cartItem.isChecked}
              userProduct={props.userProducts}
              yellowCheck={yellowCheck}
              title={cartItem.productTitle}
              dId={props.id}
              onYellowCheck={() => {
                qUpdateHandler(cartItem);
              }}
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
                        qUpdateHandler(cartItem);

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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OrderItem;
