import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
  Picker,
  Modal,
  SectionList,
  ActivityIndicator,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as sendProduct from "../store/productActions";
import * as ProdActions from "../store/productActions";
import ProductItem from "../components/ProductItem";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import InputSpinner from "react-native-input-spinner";
import { BarCodeScanner } from "expo-barcode-scanner";
import { TouchableWithoutFeedback } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as cartActions from "../store/cartAction";
import Card from "../components/Card";
import CartItem from "../components/CartItem";
import Colors from "../constants/Colors";
import { Audio } from "expo-av";

const ScannerScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanner, setScanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [size, setSize] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [sell, setSell] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadedModal, setLoadedModal] = useState(false);
  const [newQ, setNewQ] = useState();
  const [newMode, setNewMode] = useState(false);
  const [loadedMode, setLoadedMode] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [picker, setPicker] = useState(false);
  const [picked, setPicked] = useState();
  const [sound, setSound] = React.useState();
  const [scannedResults, setScannedResults] = useState();

  const dispatch = useDispatch();

  const userProducts = useSelector((state) => {
    const transformedProducts = [];
    for (const key in state.products.products) {
      transformedProducts.push({
        productId: key,
        productTitle: state.products.products[key].Title,
        productPrice: state.products.products[key].Price,
        productCategory: state.products.products[key].Category,
        productOwner: state.products.products[key].ownerId,
        productQuantity: state.products.products[key].Quantity,
        productSize: state.products.products[key].Size,
        productBrand: state.products.products[key].Brand,
        productTime: state.products.products[key].time,
        productcode: state.products.products[key].Code,
        docTitle: state.products.products[key].docTitle,
      });
    }
    return transformedProducts;
  });

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        productcode: state.cart.items[key].productcode,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  let catArray = [
    "Embutidos",
    "Frutas y Verduras",
    "Panaderia y Dulces",
    "Huevos y Lacteos",
    "Infantil",
    "Aceites y Legumbres",
    "Pastas",
    "Conservas y comida preparada",
    "Bebidas sin alcohol",
    "Bebidas con alcohol",
    "Congelados",
    "Aperitivos",
    "Cosmetica y Cuidado personal",
    "Hogar y Limpieza",
  ];
  let catOptions = catArray.sort();

  const availableProducts = useSelector(
    (state) => state.availableProducts.availableProducts
  );
  const loadDetails = useCallback(async () => {
    setIsRefreshing(true);
    try {
      dispatch(ProdActions.fetchProducts());
      dispatch(ProdActions.fetchAvailableProducts());
    } catch (err) {
      setError(err.message);
    }

    setIsRefreshing(false);
  });
  // useEffect(() => {
  //   const willFocusSub = props.navigation.addListener("willFocus", loadDetails);
  //   return () => {
  //     willFocusSub.remove();
  //   };
  // }, [loadDetails]);
  useEffect(() => {
    // loadDetails();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, [code]);

  useEffect(() => {
    dispatch(ProdActions.fetchAvailableProducts());
  }, []);

  const modeHandler = () => {
    setSell((prevState) => !prevState);
    console.log(sell);
    // props.navigation.setParams({ mode: sell });
  };

  const newEntry = () => {
    dispatch(
      sendProduct.addedProduct(
        newProduct,
        newSize,
        newPrice,
        newCategory,
        newBrand,
        code
      )
    );

    Alert.alert(
      "Agregar a tu inventario?",
      "Quisiera agregar el producto directo a tu inventario?",
      [
        {
          text: "No",
          onPress: () => {
            // setManualAdd(!manualAdd);
            setNewMode(false);
            setLoadedMode(false);
            setModalVisible(!modalVisible);
            setScanned(false);
          },
        },
        {
          text: "Si",
          onPress: () => {
            // setManualAdd(!manualAdd);
            // setModalVisible(!modalVisible);
            // setLoadedModal(true);
            console.log("ADDING TO BOOK and mode is", newMode);
            setTitle(newProduct);
            setPrice(newPrice);
            setCategory(newCategory);
            setSize(newSize);
            setCode(code);
            setBrand(newBrand);
            setNewMode(false);
            setLoadedMode(true);
          },
        },
      ]
    );

    // setModalVisible(false);
    // setTitle(true);

    // setTimeout(() => {
    //   loadDetails();
    // }, 1000);
  };

  const newInvProd = () => {
    let Title = title;
    let Price = price;
    let Category = category;
    let Quantity = newQ;
    let Size = size;
    let Brand = brand;
    let Code = code;
    console.log(
      "new product added now going to add product to the inventory list"
    );
    dispatch(
      sendProduct.createProduct(
        Title,
        Price,
        Category,
        Quantity,
        Size,
        Brand,
        Code
      )
    );
    setLoadedMode(false);
    continueScan();
    setModalVisible(false);
  };

  const quantityUpdateHandler = () => {
    console.log(
      "FROM NEW PRODUCT TO NEW Q",
      title,
      price,
      category,
      newQ,
      size,
      code
    );
    dispatch(
      sendProduct.quantityUpdate(title, price, category, newQ, size, code)
    );
    setTimeout(() => {
      loadDetails();
    }, 1000);
  };

  // const uploadProduct = (
  //   Title,
  //   Price,
  //   Category,
  //   Quantity,
  //   Size,
  //   Brand,
  //   Code
  // ) => {
  //   console.log("data listed", Quantity);
  //   try {
  //     if (Quantity > 1) {
  //       console.log(
  //         "item already exist, updating",
  //         Title,
  //         Price,
  //         Category,
  //         Quantity,
  //         Size,
  //         Brand,
  //         Code
  //       );

  //       dispatch(
  //         sendProduct.updateProducts(
  //           Title,
  //           Price,
  //           Category,
  //           Quantity,
  //           Size,
  //           Brand,
  //           Code
  //         )
  //       );
  //     } else {
  //       console.log("first upload");
  //       console.log(Title, Price, Category, Quantity, Size, Code);
  //       dispatch(
  //         sendProduct.createProduct(
  //           Title,
  //           Price,
  //           Category,
  //           Quantity,
  //           Size,
  //           Brand,
  //           Code
  //         )
  //       );
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //     console.log(error);
  //   }
  //   loadDetails();
  // };

  const minusProduct = (Title, Price, Category, Quantity, Size, Code) => {
    try {
      console.log("subtracting product quantity");
      dispatch(
        sendProduct.subProducts(Title, Price, Category, Quantity, Size, Code)
      );
    } catch (err) {
      setError(err.message);
      console.log(error);
    }
    loadDetails();
  };

  const continueScan = () => {
    setScanned(false);
  };

  let Title;
  let Price;
  let Category;
  let Quantity;
  let Size;
  let Brand;
  let Code;
  let alertQuantity;
  let result;

  const sendOrderHandler = async () => {
    console.log("Ready to get it started");
    setIsLoading(true);
    await dispatch(sendProduct.createOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  const onChargePress = () => {
    console.log("checking scannedresults", cartItems);
    const userCode = userProducts.productcode;
    console.log("what is this usercode", userCode);
    const scannedUserProduct = cartItems.find(
      (code) => code.productcode === userCode
    );
    console.log("subtracting product quantity", scannedUserProduct);
    try {
      const subNum = scannedUserProduct.quantity;
      dispatch(sendProduct.subProducts(scannedUserProduct, subNum));
    } catch (err) {
      setError(err.message);
      console.log(error);
    }
    console.log("order up");
  };

  const handleBarCodeScannedSell = async ({ type, data }) => {
    setScanned(true);

    const userProduct = userProducts.find((code) => code.productcode === data);

    if (userProduct) {
      console.log("scanned something to sell");
      async function playSound() {
        console.log("Loading Sound");
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/beep.mp3")
        );
        setSound(sound);

        console.log("Playing Sound");
        await sound.playAsync();
      }
      playSound();
      Alert.alert("Producto Escaneado", `${userProduct.productTitle}`, [
        {
          text: "Continuar",
          style: "cancel",
          onPress: () => {
            setScanned(false);
          },
        },
        {
          text: "Cobrar",
          onPress: () => {
            console.log("cobrandose");
            subProudct();
            setScanned(false);
          },
        },
      ]);
      await dispatch(cartActions.addToCart(userProduct));
      // console.log("these are scanned products", cartItems);
    }

    // console.log("these are scanned products", cartItems);
    const scannedUserProduct = cartItems.find(
      (code) => code.productcode === data
    );
    setScannedResults(cartItems);

    const subProudct = () => {
      try {
        const subNum = scannedUserProduct.quantity;
        console.log("subtracting product quantity", subNum);
        dispatch(sendProduct.subProducts(scannedUserProduct, subNum));
      } catch (err) {
        setError(err.message);
        console.log(error);
      }
    };

    // console.log(
    //   "THIS SHOULD BE scanneduserproduct",
    //   scannedUserProduct.quantity
    // );
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // console.log(availableProducts);
    const userQuantity = userProducts.find((prod) => prod.productcode === data);
    const loadedProduct = availableProducts.find((code) => code.code === data);
    const userProduct = userProducts.find((code) => code.productcode === data);

    if (data) {
      Code = data.toString();
      setCode(data);
    }

    if (typeof loadedProduct === "undefined") {
      setNewMode(true);
      setLoadedMode(false);
    }

    if (userProduct) {
      setLoadedMode(true);
      setNewMode(false);
      console.log("THIS IS USERLOADED PRODUCT", userProduct);
      try {
        Title = userProduct.productTitle;
        Price = userProduct.productPrice;
        Category = userProduct.productCategory;
        Size = userProduct.productSize;
        Brand = userProduct.productBrand;
        Code = userProduct.productcode.toString();
        console.log("THIS IS FIRST CODE TEST", Code);
        Quantity =
          typeof userQuantity === "undefined"
            ? 0
            : userQuantity.productQuantity;
        alertQuantity = !sell ? Quantity + 1 : Quantity - 1;
        console.log("this is var Quantity", Quantity);
        setCode(Code);
      } catch (err) {
        setError(err.message);
      }
    }
    // if (loadedProduct) {
    //   console.log("THIS IS LOADED PRODUCT", loadedProduct);
    //   Alert.alert(
    //     "Agregar a su inventario?",
    //     "Este producto no esta en su inventario, agregarla?",
    //     [
    //       {
    //         text: "No",
    //         style: "cancel",
    //         onPress: () => {
    //           setLoadedMode(false);
    //           setModalVisible(!modalVisible);
    //           setScanned(false);
    //         },
    //       },
    //       {
    //         text: "Si",
    //         onPress: () => {
    //           setLoadedMode(true);
    //           setNewMode(false);
    //           try {
    //             Title = loadedProduct.Product;
    //             Price = loadedProduct.Price;
    //             Category = loadedProduct.Category;
    //             Size = loadedProduct.Size;
    //             Brand = loadedProduct.Brand;
    //             Code = loadedProduct.code.toString();
    //             console.log("THIS IS FIRST CODE TEST", Code);
    //             Quantity =
    //               typeof userQuantity === "undefined"
    //                 ? 0
    //                 : userQuantity.productQuantity;
    //             alertQuantity = !sell ? Quantity + 1 : Quantity - 1;
    //             console.log("this is var Quantity", Quantity);
    //             setCode(Code);
    //             setScanned(false);
    //           } catch (err) {
    //             setError(err.message);
    //           }
    //         },
    //       },
    //       {
    //         text: "Ver Detalles",
    //       },
    //     ]
    //   );
    // }

    // if (!sell && loadedProduct) {
    //   uploadProduct(Title, Price, Category, Quantity, Size, Brand, Code);
    // }
    if (sell) {
      minusProduct(Title, Price, Category, Quantity, Size, Brand, Code);
    }

    // setTimeout(() => {
    //   loadDetails();
    // }, 1000);

    setModalVisible(true);

    console.log("code scanned", data);
    setTitle(Title);
    setPrice(Price);
    setSize(Size);
    setQuantity(Quantity);
    setCategory(Category);
    setBrand(Brand);
    setCode(Code);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (sell) {
    return (
      <View
        style={{
          flex: 1,
        }}
        // marginTop: 40,
        // flexDirection: "column",
        // justifyContent: "flex-end",
      >
        <TouchableOpacity
          onPress={() => {
            modeHandler();
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              margin: 15,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: sell ? "green" : "blue",
              }}
            >
              Modo: {sell ? "Vender" : "Contar"}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: "50%",
            width: "100%",
            marginBottom: 5,
          }}
        >
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScannedSell}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        <Card style={styles.summary}>
          <Text style={styles.summaryText}>
            Total:{" "}
            <Text style={styles.amount}>
              {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}bs
              {/* {cartTotalAmount}jjav */}
            </Text>
          </Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Button
              color={Colors.primary}
              title="Cobrar"
              disabled={cartItems.length === 0}
              // onPress={sendOrderHandler}
              onPress={sendOrderHandler}
            />
          )}
        </Card>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.productId}
          renderItem={(itemData) => (
            <CartItem
              quantity={itemData.item.quantity}
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              deletable
              onRemove={() => {
                dispatch(cartActions.removeFromCart(itemData.item.productId));
              }}
            />
          )}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
      // marginTop: 40,
      // flexDirection: "column",
      // justifyContent: "flex-end",
    >
      <TouchableOpacity
        onPress={() => {
          modeHandler();
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            margin: 15,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: sell ? "green" : "blue",
            }}
          >
            Modo: {sell ? "Vender" : "Contar"}
          </Text>
        </View>
      </TouchableOpacity>
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
                  {loadedMode && (
                    <View>
                      <Text style={styles.modalTitle}>Producto escaneado:</Text>
                      <Text style={styles.modalHead}>{title}</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={styles.modalItemBorder}>
                          <Text style={styles.modalTextTitle}>Marca: </Text>
                          <Text style={styles.modalText}>{brand}</Text>
                        </View>

                        <View style={styles.modalItemBorder}>
                          <Text style={styles.modalTextTitle}>Precio: </Text>
                          <Text style={styles.modalText}>${price}bs</Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={styles.modalItemBorder}>
                          <Text style={styles.modalTextTitle}>Tamaño: </Text>
                          <Text style={styles.modalText}>{size}</Text>
                        </View>

                        <View style={styles.modalItemBorder}>
                          <Text style={styles.modalTextTitle}>Cantidad: </Text>
                          <Text style={styles.modalText}>{quantity}</Text>
                        </View>
                      </View>
                      <View style={styles.modalItemBorderCategoria}>
                        <Text style={styles.modalTextTitle}>Categoria: </Text>
                        <Text style={styles.modalText}>{category}</Text>
                      </View>
                    </View>
                  )}
                  {newMode && (
                    <View>
                      <Text style={styles.modalTitle}>Nuevo Producto</Text>
                      <View>
                        <TextInput
                          style={styles.textInputStyle}
                          placeholder="Producto"
                          placeholderTextColor="silver"
                          value={newProduct}
                          onChangeText={(name) => {
                            setNewProduct(name);
                          }}
                        />
                        <TextInput
                          style={styles.textInputStyle}
                          placeholder="Marca"
                          placeholderTextColor="silver"
                          value={newBrand}
                          onChangeText={(brand) => {
                            setNewBrand(brand);
                          }}
                        />
                        <TextInput
                          style={styles.textInputStyle}
                          keyboardType="numeric"
                          placeholderTextColor="silver"
                          placeholder="Precio"
                          value={newPrice}
                          onChangeText={(price) => {
                            setNewPrice(price);
                          }}
                        />
                        <TextInput
                          style={styles.textInputStyle}
                          placeholder="Tomaño"
                          placeholderTextColor="silver"
                          value={newSize}
                          onChangeText={(size) => {
                            setNewSize(size);
                          }}
                        />
                        <View>
                          <Text style={styles.modalText}>
                            Categoria: {newCategory}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={{
                            ...styles.openButton,
                            backgroundColor: "#A251F9",
                          }}
                          onPress={() => {
                            setPicker(true);
                          }}
                        >
                          <Text style={styles.textStyle}>Categoria</Text>
                          {/* this is for scanner true */}
                        </TouchableOpacity>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={picker}
                          onRequestClose={() => {
                            // setPicker(!picker);
                          }}
                        >
                          <View style={styles.centeredView}>
                            <View style={styles.modalViewPicker}>
                              <Picker
                                selectedValue={picked}
                                mode="dropdown"
                                style={{
                                  height: 30,
                                  marginTop: 20,
                                  // marginBottom: 30,
                                  width: "100%",
                                  justifyContent: "center",
                                }}
                                itemStyle={{ fontSize: 16 }}
                                onValueChange={(itemValue) =>
                                  setPicked(itemValue)
                                }
                              >
                                {catOptions.map((item, index) => {
                                  return (
                                    <Picker.Item
                                      label={item}
                                      value={item}
                                      key={index}
                                    />
                                  );
                                })}
                              </Picker>
                              <View
                                style={{
                                  width: "100%",
                                  flexDirection: "row",
                                  justifyContent: "space-around",
                                  marginTop: 90,
                                }}
                              >
                                <TouchableOpacity
                                  style={{
                                    ...styles.openButton,
                                  }}
                                  onPress={() => {
                                    setPicker(!picker);
                                  }}
                                >
                                  <Text style={styles.textStyle}>Volver</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    ...styles.openButton,
                                  }}
                                  onPress={() => {
                                    setNewCategory(picked);
                                    setPicker(false);
                                  }}
                                >
                                  <Text style={styles.textStyle}>Guardar</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </Modal>
                      </View>
                    </View>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.modalTextCode}>Codigo: </Text>
                    <Text style={styles.modalTextCodigo}>{code}</Text>
                  </View>
                  {/* <Text style={styles.modalText}>Codigo: {code}</Text> */}
                  {/* </View> */}

                  {loadedMode && (
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
                        max={10000}
                        min={0}
                        step={1}
                        fontSize={20}
                        onMax={(max) => {
                          Alert.alert(
                            "llego al Maximo",
                            "El maximo seria 1000"
                          );
                        }}
                        skin={"clean"}
                        background={"#F5F3F3"}
                        // colorAsBackground={true}
                        colorMax={"red"}
                        width={"50%"}
                        colorMin={"green"}
                        colorLeft={"#FF4949"}
                        colorRight={"#FF4949"}
                        value={quantity}
                        onChange={(num) => {
                          if (num === quantity) {
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
                        backgroundColor: "#FF4949",
                      }}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        setLoadedMode(false);
                        setNewMode(false);
                        setScanned(false);
                      }}
                    >
                      <Text style={styles.textStyle}>Volver</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.openButton,
                        backgroundColor: "#FF4949",
                      }}
                      onPress={() => {
                        if (newMode) {
                          newEntry();
                          console.log("theres a new product", newProduct);
                          continueScan();
                        }
                        if (loadedMode) {
                          console.log("NEW PRODUCT ADDED now for inventory");
                          newInvProd();
                          // setModalVisible(!modalVisible);
                          // continueScan();
                        }
                        if (title) {
                          console.log(
                            "not adding a new product just to the inventory"
                          );
                          quantityUpdateHandler();
                          setModalVisible(!modalVisible);
                          continueScan();
                        }
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

      <View
        style={{
          height: "80%",
          width: "100%",
          marginBottom: 40,
        }}
      >
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </View>
  );
};

ScannerScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Escanear",
  };
};
export default ScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    width: "95%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
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
  modalViewPicker: {
    flex: 0.3,
    justifyContent: "center",
    height: "40%",
    width: "95%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    alignContent: "center",

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
    backgroundColor: "#FF4949",
    borderRadius: 20,
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 1.84,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalTextTitle: {
    // marginBottom: 2,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 2,
    textAlign: "center",
    fontSize: 22,
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
  quantitySelect: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 17,
    color: "silver",
  },
  modalItemBorder: {
    width: 150,
    backgroundColor: "#F5F3F3",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#F5F3F3",
    // justifyContent: "space-between",
    margin: 5,
    padding: 5,
    shadowColor: "silver",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 1.84,
    elevation: 1,
  },
  modalItemBorderCategoria: {
    backgroundColor: "#F5F3F3",
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#F5F3F3",
    // justifyContent: "space-between",
    margin: 5,
    padding: 5,
    shadowColor: "silver",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 1.84,
    elevation: 1,
  },
  modalHead: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4949",
  },
  modalTitle: {
    marginBottom: 2,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    margin: 5,
    borderColor: "black",
    backgroundColor: "#FFFFFF",
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    // fontFamily: "open-sans-bold",
    fontSize: 30,
  },
  amount: {
    color: Colors.primary,
  },
});
