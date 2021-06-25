import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Modal,
  KeyboardAvoidingView,
  Dimensions,
  TouchableNativeFeedback,
  Alert,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import * as sendProduct from "../store/productActions";
import Moment from "moment";
import localization from "moment/locale/es-us";
import InputSpinner from "react-native-input-spinner";
import { useSelector, useDispatch } from "react-redux";
import { Octicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import { extendMoment } from "moment-range";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";

const { height, width } = Dimensions.get("window");
const itemWidth = (width - (15 * 2 + 5 * (2 - 1))) / 2;
const CategoryGridTile = (props) => {
  let TouchableCmp = TouchableOpacity;
  const { user, addMemProd } = useContext(AuthContext);
  const db = firebase.firestore().collection("Members");
  const [quantityColor, setQuantity] = useState("#666");
  const [userProducts, setUserProducts] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [newQ, setNewQ] = useState();
  const [editVisible, setEditVisible] = useState(false);
  const [prompt, setPrompt] = useState();
  const [type, setType] = useState();
  const [newText, setNewText] = useState();
  const [extendedDate, setExtendedDate] = useState(false);
  const [expDate, setExpDate] = useState();

  // const userProducts = useSelector((state) => {
  //   const transformedProducts = [];
  //   for (const key in state.products.products) {
  //     transformedProducts.push({
  //       productId: key,
  //       productTitle: state.products.products[key].Title,
  //       productPrice: state.products.products[key].Price,
  //       productCategory: state.products.products[key].Category,
  //       productOwner: state.products.products[key].ownerId,
  //       productQuantity: state.products.products[key].Quantity,
  //       productSize: state.products.products[key].Size,
  //       productBrand: state.products.products[key].Brand,
  //       productTime: state.products.products[key].time,
  //       productcode: state.products.products[key].Code,
  //       docTitle: state.products.products[key].docTitle,
  //     });
  //   }
  //   return transformedProducts;
  // });

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

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
    const fetchPost = async () => {
      try {
        const list = [];
        await firebase
          .firestore()
          .collection("Members")
          .doc(user.uid)
          .collection("Member Products")
          .orderBy("Title", "asc")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const {
                Title,
                Quantity,
                Category,
                Price,
                ownerId,
                Brand,
                Code,
                ExpDate,
                Size,
                docTitle,
              } = doc.data();
              list.push({
                key: doc.id,
                productTitle: Title,
                productPrice: Price,
                productCategory: Category,
                productOwner: ownerId,
                productQuantity: Quantity,
                productSize: Size,
                productBrand: Brand,
                productcode: Code,
                productExp: ExpDate,
                docTitle: docTitle,
              });
            });
          });
        setUserProducts(list);
      } catch (e) {
        console.log(e);
      }
    };
    fetchPost();
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

  const afterAddedHandler = () => {
    const userProductExist = userProducts.find(
      (prod) => prod.productcode === props.code
    );
    if (userProductExist) {
      Alert.alert(
        `El producto ${props.title} ya esta en su inventario`,
        `Usted Puede modificar su producto directo.`,
        [
          {
            text: "Listo",
            style: "cancel",
          },
          // {
          //   text: "Si",
          //   onPress: () => setModalVisible(true),
          // },
        ]
      );
    } else {
      let Title;
      let Price;
      let Category;
      let Size;
      let Brand;
      let Code;

      var Quantity = 0;

      Title = props.title;
      Price = props.price;
      Category = props.category;
      Size = props.size;
      Brand = props.brand;
      Code = props.code;
      addMemProd(Title, Price, Category, Quantity, Size, Brand, Code);
      Alert.alert(
        `El producto ${props.title} ha sido agregado!`,
        `Usted quisiera editar el producto?`,
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Si",
            onPress: () => setModalVisible(true),
          },
        ]
      );
    }
  };

  return (
    // <View>
    <View style={styles.gridItem}>
      <TouchableCmp
        style={{ flex: 1 }}
        onPress={() => {
          Alert.alert(
            "Agregar Producto?",
            `Usted quisiera agregar ${props.title} a su inventario?`,
            [
              {
                text: "No",
                style: "cancel",
              },
              {
                text: "Si",
                onPress: () => afterAddedHandler(true),
              },
            ]
          );
        }}
      >
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
            {props.brand}
          </Text>
        </View>
      </TouchableCmp>
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
                            // or props.quantity?
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
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1 / 2,
    backgroundColor: "#FF4949",
    margin: 15,
    width: "90%",
    height: "90%",
    borderRadius: 10,
    shadowColor: "#FF4949",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
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
    marginBottom: 5,
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
  // title: {
  //   color: "black",
  //   fontSize: 21,
  //   marginBottom: 5,
  //   fontWeight: "bold",
  // },
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

export default CategoryGridTile;
