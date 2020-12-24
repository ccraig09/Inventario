import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
// import Colors from "../constants/Colors";
import InputSpinner from "react-native-input-spinner";
import { useSelector, useDispatch } from "react-redux";

import * as sendProduct from "../store/productActions";

const ProductItem = (props) => {
  const [quantityColor, setQuantity] = useState("#666");
  const [modalVisible, setModalVisible] = useState(false);
  const [newQ, setNewQ] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.quantity > 5) {
      setQuantity("red");
    }
  }, []);

  const quantityUpdateHandler = (newQ) => {
    let title;
    let price;
    let category;
    let size;
    let code;

    title = props.title;
    price = props.price;
    category = props.category;
    size = props.size;
    code = props.code;

    dispatch(
      sendProduct.quantityUpdate(title, price, category, newQ, size, code)
    );
    setTimeout(() => {
      props.reload();
    }, 1000);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(true);
        // alert(itemData.item.productTitle);
      }}
      style={styles.placeItem}
    >
      {/* <Image style={styles.image} source={{ uri: props.image }} /> */}
      <View style={styles.itemSpacing}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.address}>Tamaño: {props.size}</Text>
          {/* <Text style={styles.address}>Categoria: {props.category}</Text> */}
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: "black",
            margin: 5,
          }}
        />
        <View>
          <Text style={styles.addressTitle}>Precio: </Text>
          <Text style={styles.addressNumber}>{props.price} bs</Text>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: "black",
            margin: 5,
          }}
        />
        <View>
          <Text style={styles.addressTitle}>Cantidad: </Text>
          <Text
            style={
              (styles.quantityNumber,
              { color: props.quantity < 5 ? "red" : "#666" })
            }
          >
            {props.quantity}
          </Text>
        </View>
        {/* <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: "black",
            margin: 5,
          }}
        />
        <View>
          <Text style={styles.addressTitle}>Fecha Ven. </Text>
          <Text
            style={
              (styles.quantityNumber,
              { color: props.quantity < 5 ? "red" : "#666" })
            }
          >
            {props.quantity}
          </Text>
        </View>
      </View> */}
      </View>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "android" ? "padding" : "position"}
        keyboardVerticalOffset={-80}
        // style={styles.screen}
      >
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            // onRequestClose={() => {
            //   Alert.alert("Modal has been closed.");
            // }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {props.title && (
                    <View>
                      <Text style={styles.modalTitle}>Editar Producto:</Text>
                      <Text style={styles.modalHead}>{props.title}</Text>
                      <Text style={styles.modalText}>
                        Precio: ${props.price}bs
                      </Text>
                      <Text style={styles.modalText}>
                        Categoria: {props.category}
                      </Text>
                      <Text style={styles.modalText}>
                        Cantidad Total: {props.quantity}
                      </Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.modalText}>Codigo: {props.code}</Text>
                  </View>

                  {props.title && (
                    <View
                      style={{
                        margin: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.quantitySelect}>
                        (Opcional) Entrar cantidad
                      </Text>

                      <InputSpinner
                        max={1000}
                        min={0}
                        step={1}
                        fontSize={25}
                        onMax={(max) => {
                          Alert.alert(
                            "llego al Maximo",
                            "El maximo seria 1000"
                          );
                        }}
                        colorMax={"red"}
                        colorMin={"green"}
                        colorLeft={"red"}
                        colorRight={"blue"}
                        value={props.quantity}
                        onChange={(num) => {
                          // const newQ = num;
                          if (num === props.quantity) {
                            null;
                          } else {
                            setNewQ(num);
                          }
                        }}
                      />
                    </View>
                  )}

                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        ...styles.openButton,
                        backgroundColor: "green",
                      }}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}
                    >
                      <Text style={styles.textStyle}>Volver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.openButton,
                        backgroundColor: "#2196F3",
                      }}
                      onPress={() => {
                        quantityUpdateHandler(newQ);
                        setModalVisible(!modalVisible);
                        props.reload();
                      }}
                    >
                      <Text style={styles.textStyle}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  placeItem: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  itemSpacing: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ccc",
    borderColor: "purple",
    borderWidth: 1,
  },
  infoContainer: {
    marginLeft: 2,
    width: 170,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  circle: {
    borderRadius: 100,
    borderWidth: 1.5,
    padding: 12,
  },
  title: {
    color: "black",
    fontSize: 18,
    marginBottom: 5,
  },
  address: {
    color: "#666",
    fontSize: 16,
  },
  addressTitle: {
    color: "black",
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  quantityNumber: {
    // color: quantityColor,
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  addressNumber: {
    color: "#666",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "95%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
  },
  quantitySelect: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 17,
    color: "silver",
  },
  modalHead: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default ProductItem;
