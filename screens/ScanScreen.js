import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  RefreshControl,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import * as sendProduct from "../store/productActions";
import * as ProdActions from "../store/productActions";
import ProductItem from "../components/ProductItem";
import InputSpinner from "react-native-input-spinner";

// import HeaderButton from "./components/HeaderButton";

import { BarCodeScanner } from "expo-barcode-scanner";
import { TouchableWithoutFeedback } from "react-native";

const ScanScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanner, setScanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [scanCount, setScanCount] = useState(0);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [size, setSize] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [value, setValue] = useState("");
  const [sell, setSell] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  const [newQ, setNewQ] = useState();
  const [newProduct, setNewProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  // const Mode = props.navigation.getParam("mode");

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
        productTime: state.products.products[key].time,
        productcode: state.products.products[key].Code,
        docTitle: state.products.products[key].docTitle,
      });
    }
    return transformedProducts;
  });

  const availableProducts2 = useSelector((state) => {
    state.products.availableProducts;
  });

  const loadDetails = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // dispatch(ProdActions.fetchProducts());
      dispatch(ProdActions.fetchAvailableProducts());
    } catch (err) {
      setError(err.message);
    }
    console.log("Gotta figure out how to load these", availableProducts2);

    setIsRefreshing(false);
  });
  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadDetails);
    return () => {
      willFocusSub.remove();
    };
  }, [loadDetails]);
  useEffect(() => {
    loadDetails();

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, [code]);

  const modeHandler = () => {
    setSell((prevState) => !prevState);
    console.log(sell);
    // props.navigation.setParams({ mode: sell });
  };

  const newEntry = () => {
    dispatch(
      sendProduct.addedProduct(newProduct, newSize, newPrice, newCategory, code)
    );
    setModalVisible(false);
    setTimeout(() => {
      loadDetails();
    }, 1000);
  };

  const quantityUpdateHandler = (newQ) => {
    dispatch(
      sendProduct.quantityUpdate(title, price, category, newQ, size, code)
    );
    setTimeout(() => {
      loadDetails();
    }, 1000);
  };

  const uploadProduct = (Title, Price, Category, Quantity, Size, Code) => {
    console.log("data listed", Quantity);
    try {
      if (Quantity > 1) {
        console.log(
          "item already exist, updating",
          Title,
          Price,
          Category,
          Quantity,
          Size,
          Code
        );

        dispatch(
          sendProduct.updateProducts(
            Title,
            Price,
            Category,
            Quantity,
            Size,
            Code
          )
        );
      } else {
        console.log("first upload");
        console.log(Title, Price, Category, Quantity, Size, Code);
        dispatch(
          sendProduct.createProduct(
            Title,
            Price,
            Category,
            Quantity,
            Size,
            Code
          )
        );
      }
    } catch (err) {
      setError(err.message);
      console.log(error);
    }
    loadDetails();
  };

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
  let Code;
  let alertQuantity;
  let result;

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    const userQuantity = userProducts.find((prod) => prod.productcode === data);

    if (data) {
      Code = data.toString();
      setCode(data);
    }

    if (data === "7771214003646") {
      try {
        Title = "Salsa Golf";
        Price = 16;
        Category = "Aderezos";
        Size = "350";
        Code = data.toString();
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

      result = `${Title} \n Tamaño: ${Size} \n Precio: ${Price}bs \n Categoria: ${Category} \n Cantidad Total: ${alertQuantity}  \n Codigo: ${Code}`;
    }
    if (data === "7790895643835") {
      try {
        Title = "Ades Jugo de Mazana";
        Price = 5;
        Category = "Bebidos";
        Size = "1L";
        Code = data.toString();
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

      result = `${Title} \n Tamaño: ${Size} \n Precio: ${Price}bs \n Categoria: ${Category} \n Cantidad Total: ${alertQuantity}  \n Codigo: ${Code}`;
    }
    if (data === "7771609001677") {
      try {
        Title = "Agua Vital sin gas";
        Price = 9;
        Category = "Bebidas";
        Size = "3 litros";
        Code = data.toString();
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

      // "Producto escaneado: \n Agua Vital sin gas \n Tamaño: 3litro \n Precio: 10bs \n Cantidad Total: 3";
      result = `${Title} \n Tamaño: ${Size} \n Precio: ${Price}bs \n Categoria: ${Category} \n Cantidad Total: ${alertQuantity}  \n Codigo: ${Code}`;
    }
    if (data === "7772115001656") {
      try {
        Title = "ReaktorAde";
        Price = 6.5;
        Category = "Bebidas";
        Size = "600";
        Code = data.toString();
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

    if (data === "7590011251100") {
      Title = "Galletas de Oreo";
      Price = 4;
      Size = "1";
      Quantity = userQuantity.productQuantity;
      alertQuantity = !sell ? Quantity + 1 : Quantity - 1;
      console.log("this is var Quantity", Quantity);
      Code = data.toString();

      // result = `${Title} \n Tamaño: ${Size} \n Precio: ${Price}bs \n Cantidad Total: ${alertQuantity} \n Codigo: ${Code}`;
    }
    if (data === "7759185002158") {
      setTitle("Elite Kleenex");
      setPrice(2);
      setSize("1");
      setCode(data.toString());

      result = `${title} \n Tamaño: ${size} \n Precio: ${price}bs \n Cantidad Total: ${alertQuantity} \n Codigo: ${code}`;
    }
    if (data === "7772106001450") {
      result =
        "Producto escaneado: \n 7-up \n Tamaño: 500ml \n Precio: 5bs \n Cantidad Total: 5";
    }
    if (data === "7771609003268") {
      try {
        Title = "Powerade azul";
        Price = 10;
        Size = "1litro";
        Quantity = userQuantity.productQuantity;
        alertQuantity = Quantity + 1;

        console.log("this is var Quantity", Quantity);
        Code = data.toString();
        setCode(Code);
      } catch (err) {
        setError(err.message);
      }

      result = `${Title} \n Tamaño: ${Size} \n Precio: ${Price}bs \n Cantidad Total: ${alertQuantity} \n Codigo: ${Code}`;
    }

    if (!sell) {
      uploadProduct(Title, Price, Category, Quantity, Size, Code);
    } else {
      minusProduct(Title, Price, Category, Quantity, Size, Code);
    }

    setTimeout(() => {
      loadDetails();
    }, 1000);

    setModalVisible(true);

    console.log(data);
    setTitle(Title);
    setPrice(Price);
    setSize(Size);
    setQuantity(alertQuantity);
    setCategory(Category);
    setCode(Code);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (!scanner) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
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
        <Button title={"Abrir Scanner"} onPress={() => setScanner(true)} />
      </View>
    );
  }
  if (scanner) {
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
                    {title && (
                      <View>
                        <Text style={styles.modalTitle}>
                          Producto escaneado:
                        </Text>
                        <Text style={styles.modalHead}>{title}</Text>
                        <Text style={styles.modalText}>Precio: ${price}bs</Text>
                        <Text style={styles.modalText}>Tamaño {size}</Text>
                        <Text style={styles.modalText}>
                          Categoria: {category}
                        </Text>
                        <Text style={styles.modalText}>
                          Cantidad Total: {quantity}
                        </Text>
                      </View>
                    )}
                    {!title && (
                      <View>
                        <Text style={styles.modalTitle}>Nuevo Producto</Text>
                        <View>
                          <TextInput
                            style={styles.textInputStyle}
                            placeholder="Producto"
                            value={newProduct}
                            onChangeText={(name) => {
                              setNewProduct(name);
                            }}
                          />
                          <TextInput
                            style={styles.textInputStyle}
                            keyboardType="numeric"
                            placeholder="Precio"
                            value={newPrice}
                            onChangeText={(price) => {
                              setNewPrice(price);
                            }}
                          />
                          <TextInput
                            style={styles.textInputStyle}
                            placeholder="Tomaño"
                            value={newSize}
                            onChangeText={(size) => {
                              setNewSize(size);
                            }}
                          />
                          <TextInput
                            style={styles.textInputStyle}
                            placeholder="Category"
                            value={newCategory}
                            onChangeText={(text) => {
                              setNewCategory(text);
                              searchFilterFunction(text);
                            }}
                          />
                          {/* <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(text) => searchFilterFunction(text)}
                            value={search}
                            underlineColorAndroid="transparent"
                            placeholder="Buscar"
                          /> */}
                        </View>
                      </View>
                    )}
                    <Text style={styles.modalText}>Codigo: {code}</Text>
                    {/* </View> */}

                    {title && (
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
                          colorMax={"red"}
                          colorMin={"green"}
                          colorLeft={"red"}
                          colorRight={"blue"}
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
                          backgroundColor: "green",
                        }}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          props.navigation.navigate("Home"), setScanned(false);
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
                          if (newProduct) {
                            newEntry();
                            console.log("theres a new product", newProduct);
                          } else {
                            quantityUpdateHandler(newQ);
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
            height: "50%",
            width: "100%",
            // marginTop: 40,
            // flexDirection: "column",
            // justifyContent: "flex-end",
          }}
        >
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        <View
          style={{
            marginBottom: 20,
            marginLeft: 20,
            marginTop: 20,
            height: "35%",
          }}
        >
          {/* <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Cosas escaneado: {scanCount}
          </Text> */}
          <View>
            <Text style={{ fontSize: 15, color: "grey" }}>
              Recien escaneado:
            </Text>
          </View>
          <FlatList
            refreshControl={
              <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={isRefreshing}
                onRefresh={() => {
                  loadDetails();
                }}
              />
            }
            data={userProducts}
            keyExtractor={(item) => item.productId}
            renderItem={(itemData) => (
              <ProductItem
                title={itemData.item.productTitle}
                onSelect={() => {
                  alert("pressed");
                }}
                size={itemData.item.productSize}
                price={itemData.item.productPrice}
                category={itemData.item.productCategory}
                quantity={itemData.item.productQuantity}
                code={itemData.item.productcode}
                reload={() => {
                  loadDetails();
                }}
              />
            )}
          />
          {/* <Button
           title={"Escanear de nuevo"}
           onPress={() => setScanned(false)}
         /> */}
        </View>
      </View>
    );
  }
};

export default ScanScreen;

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
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    margin: 5,
    borderColor: "black",
    backgroundColor: "#FFFFFF",
  },
});
