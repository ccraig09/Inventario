import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
// import Colors from "../constants/Colors";
import InputSpinner from "react-native-input-spinner";
import { useSelector, useDispatch } from "react-redux";
import { Octicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";

import moment from "moment";
import Moment from "moment";
import localization from "moment/locale/es-us";
import { extendMoment } from "moment-range";

import * as sendProduct from "../store/productActions";

const ProductItem = (props) => {
  const [quantityColor, setQuantity] = useState("#666");
  const [modalVisible, setModalVisible] = useState(false);
  const [newQ, setNewQ] = useState();
  const [editVisible, setEditVisible] = useState(false);
  const [prompt, setPrompt] = useState();
  const [type, setType] = useState();
  const [newText, setNewText] = useState();
  const [extendedDate, setExtendedDate] = useState(false);
  const [expDate, setExpDate] = useState();

  const moment = extendMoment(Moment);

  var a = moment(props.exp, "YYYYMMDD").fromNow();
  var b = props.exp;
  var c = moment(b).locale("es", localization).format("D-MM-YYYY");

  var date1 = props.exp;
  var date2 = moment();
  const range = moment.range(date2, date1);
  const dateDiff = range.diff("days");
  const minDays = () => {
    if (dateDiff > 5) dateDiff = 0;
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.quantity > 5) {
      setQuantity("red");
    }
  }, []);

  const quantityUpdateHandler = (newQ) => {
    let Title;
    let Price;
    let Category;
    let Size;
    let brand;
    let Code;

    Title = props.title;
    Price = props.price;
    Category = props.category;
    Size = props.size;
    brand = props.brand;
    Code = props.code;

    console.log("need to see these deets", Title, Code, newQ);

    dispatch(
      sendProduct.quantityUpdate(Title, Price, Category, newQ, Size, Code)
    );
    setTimeout(() => {
      props.reload();
    }, 1000);
  };

  const dateHandler = useCallback(async (date) => {
    let Code;
    Code = props.code;

    setExtendedDate(false);
    var dateChanged = moment(date).format("YYYYMMDD");
    setExpDate(date);
    dispatch(sendProduct.expDateUpdate(dateChanged, Code));
    props.reload();
  });

  const itemUpdateHandler = () => {
    let Code;
    Code = props.code;
    console.log("need to see these deets", newText, type);
    if (type === "Titulo") {
      console.log("type is Title");
      dispatch(sendProduct.titleUpdate(newText, Code));
    }
    if (type === "Marca") {
      console.log("type is Marca");
      dispatch(sendProduct.brandUpdate(newText, Code));
    }
    if (type === "Precio") {
      console.log("type is Precio");
      dispatch(sendProduct.priceUpdate(newText, Code));
    }
    if (type === "Tomaño") {
      console.log("type is Tomaño");
      dispatch(sendProduct.sizeUpdate(newText, Code));
    }
    if (type === "Categoria") {
      console.log("type is Categoria");
      dispatch(sendProduct.categoryUpdate(newText, Code));
    }
    setNewText();
    setTimeout(() => {
      props.reload();
    }, 1000);
  };

  const itemDeleteHandler = () => {
    Alert.alert(
      "Borrar producto?",
      `El producto ___ será borrado de tu inventario?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Si",
          onPress: () => DeleteHandler(),
        },
      ]
    );
  };

  const DeleteHandler = () => {
    let Code = props.code;
    console.log("code to delete", Code);
    dispatch(sendProduct.productDelete(Code));
    setModalVisible(!modalVisible);
    props.reload();
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(true);
      }}
      style={styles.placeItem}
    >
      <View style={styles.itemSpacing}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{props.title}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.addressTitle}>Precio (bs): </Text>
          <Text style={styles.addressNumber}>{props.price}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.addressTitle}>Cantidad: </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              color: props.quantity < 5 ? "red" : "#666",
            }}
          >
            {props.quantity}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.addressTitle}>Fecha: </Text>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.dateNumber, { color: "#666", fontSize: 18 }]}>
              {c}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {dateDiff > 9000 ? (
                <Text style={[styles.dateNumber, { color: "red" }]}>
                  {" "}
                  (0 dias)
                </Text>
              ) : (
                <Text style={[styles.dateNumber, { color: "#666" }]}>
                  {" "}
                  ({dateDiff} dias)
                </Text>
              )}
              <View style={{ marginBottom: 2 }}>
                {dateDiff < 5 && (
                  <Octicons name="alert" size={15} color="red" />
                )}
              </View>
            </View>
          </View>
          {/* <Text style={[styles.dateNumber, { color: "#666" }]}></Text> */}
        </View>
      </View>

      {/* </View> */}
      {/* </View> */}
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
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editVisible}
                    onRequestClose={() => {
                      setPrompt();
                      setEditVisible(!editVisible);
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {
                        Keyboard.dismiss();
                      }}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={styles.modalEdit2}>Editar:</Text>
                          <Text style={styles.modalEdit}>{type}</Text>
                          <TextInput
                            style={styles.textInputStyle}
                            clearButtonMode={"always"}
                            underlineColorAndroid="transparent"
                            // placeholder={newText}
                            onChangeText={(text) => setNewText(text)}
                            value={newText}
                          />
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
                                setPrompt();
                                setEditVisible(!editVisible);
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
                                itemUpdateHandler();
                                setPrompt();
                                setEditVisible(!editVisible);
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
                  {props.title && (
                    <View>
                      <Text style={styles.modalTitle}>Editar Producto:</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setPrompt(props.title);
                          setType("Titulo");
                          setEditVisible(true);
                        }}
                      >
                        <Text style={styles.modalHead}>{props.title}</Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.modalText}>Marca: </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setPrompt(props.brand);
                            setType("Marca");
                            setEditVisible(true);
                          }}
                        >
                          <Text style={styles.modalText}>{props.brand}</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.modalText}>Precio: </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setPrompt(props.price);
                            setType("Precio");
                            setEditVisible(true);
                          }}
                        >
                          <Text style={styles.modalText}>${props.price}bs</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.modalText}>Tamaño: </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setPrompt(props.size);
                            setType("Tomaño");
                            setEditVisible(true);
                          }}
                        >
                          <Text style={styles.modalText}>{props.size}</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.modalText}>Categoria: </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setPrompt(props.category);
                            setType("Categoria");
                            setEditVisible(true);
                          }}
                        >
                          <Text style={styles.modalText}>{props.category}</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setExtendedDate(true);
                            // setPrompt(props.category);
                            // setType("Categoria");
                            // setEditVisible(true);
                          }}
                        >
                          <Text style={styles.modalText}>Fecha de Exp: </Text>
                          <Text style={styles.modalText}>
                            {moment(props.exp)
                              .locale("es", localization)
                              .format("LL")}
                          </Text>
                        </TouchableOpacity>

                        {extendedDate && (
                          <View>
                            <DateTimePicker
                              mode="date"
                              isVisible={extendedDate}
                              locale="es-ES"
                              onConfirm={
                                (date) => {
                                  dateHandler(date);
                                }
                                // this.handleDatePicked(date, "start", "showStart")
                              }
                              onCancel={() => {
                                setExtendedDate(false);
                              }}
                              cancelTextIOS={"Cancelar"}
                              confirmTextIOS={"Confirmar"}
                              headerTextIOS={"Elige una fecha"}
                            />
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.modalText}>Cantidad Total: </Text>
                        <Text style={styles.modalText}>{props.quantity}</Text>
                      </View>
                    </View>
                  )}

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
                        colorLeft={"purple"}
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
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.modalTextCode}>Codigo: </Text>
                    <Text style={styles.modalTextCodigo}>{props.code}</Text>
                  </View>

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
                        backgroundColor: "red",
                      }}
                      onPress={() => {
                        itemDeleteHandler();
                      }}
                    >
                      <Text style={styles.textStyle}>Borrar</Text>
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
    backgroundColor: "white",
    flex: 1,
    // borderBottomColor: "#ccc",
    // borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 20,
    margin: 5,
    borderRadius: 10,
    // borderWidth: 0.9,
    borderColor: "#FF4949",
    shadowColor: "#FF4949",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 9,
  },
  itemSpacing: {
    // flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    paddingHorizontal: 15,
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
    // marginLeft: 2,
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
    fontSize: 21,
    marginBottom: 5,
    fontWeight: "bold",
  },
  address: {
    color: "#666",
    fontSize: 16,
  },
  addressTitle: {
    color: "grey",
    fontWeight: "bold",
    fontSize: 18,
    // marginBottom: 15,
    // textAlign: "center",
  },
  quantityNumber: {
    // color: quantityColor,
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateNumber: {
    // color: quantityColor,
    fontWeight: "bold",
    textAlign: "center",
  },
  addressNumber: {
    color: "#666",
    fontSize: 20,
    fontWeight: "bold",
    // textAlign: "center",
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
  editView: {
    width: "75%",
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
    textDecorationLine: "underline",
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  modalEdit2: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalEdit: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    // fontWeight: "bold",
  },
  modalTextCode: {
    color: "grey",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "left",
    fontSize: 20,
  },
  modalTextCodigo: {
    color: "grey",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "right",
    fontSize: 20,
  },
  textInputStyle: {
    height: 40,
    width: "70%",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    borderColor: "black",
    backgroundColor: "#FFFFFF",
  },
});

export default ProductItem;
