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
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import * as sendProduct from "../store/productActions";
import * as ProdActions from "../store/productActions";
import ProductItem from "../components/ProductItem";
import CategoryGridTile from "../components/CategoryGridTile";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import { Avatar, Divider, Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import InputSpinner from "react-native-input-spinner";

// import HeaderButton from "./components/HeaderButton";

import { BarCodeScanner } from "expo-barcode-scanner";
import { TouchableWithoutFeedback } from "react-native";

const ScanScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanner, setScanner] = useState(false);
  const [menu, setMenu] = useState(false);
  const [manualAdd, setManualAdd] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [scanCount, setScanCount] = useState(0);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [size, setSize] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [value, setValue] = useState("");
  const [sell, setSell] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(0);
  const [newQ, setNewQ] = useState();
  const [newMode, setNewMode] = useState(true);
  const [newProduct, setNewProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [picker, setPicker] = useState(false);
  const [picked, setPicked] = useState();
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [productSelect, setProductSelect] = useState(true);
  const [categorySelect, setCategorySelect] = useState(false);
  const [brandSelect, setBrandSelect] = useState(false);

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
        productBrand: state.products.products[key].Brand,
        productTime: state.products.products[key].time,
        productcode: state.products.products[key].Code,
        docTitle: state.products.products[key].docTitle,
      });
    }
    return transformedProducts;
  });

  const availableProducts = useSelector(
    (state) => state.availableProducts.availableProducts
  );
  const loadDetails = useCallback(async () => {
    setIsRefreshing(true);
    try {
      dispatch(ProdActions.fetchProducts());
      dispatch(ProdActions.fetchAvailableProducts());
      console.log("Gotta figure out how to load these", productList);
    } catch (err) {
      setError(err.message);
    }

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

  useEffect(() => {
    dispatch(ProdActions.fetchAvailableProducts());
  }, []);

  const modeHandler = () => {
    setSell((prevState) => !prevState);
    console.log(sell);
    // props.navigation.setParams({ mode: sell });
  };
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        if (productSelect) {
          const itemData = item.productTitle
            ? item.productTitle.toUpperCase()
            : "".toUpperCase();
          const textData = text.toUpperCase();
          // console.log("ITEMDATA IS===", textData);
          return itemData.indexOf(textData) > -1;
        }
        if (categorySelect) {
          const itemData = item.productCategory
            ? item.productCategory.toUpperCase()
            : "".toUpperCase();
          const textData = text.toUpperCase();
          // console.log("ITEMDATA IS===", textData);
          return itemData.indexOf(textData) > -1;
        }
        if (brandSelect) {
          const itemData = item.productBrand
            ? item.productBrand.toUpperCase()
            : "".toUpperCase();
          const textData = text.toUpperCase();
          // console.log("ITEMDATA IS===", textData);
          return itemData.indexOf(textData) > -1;
        }
        // const textData = text.toUpperCase();
        // // console.log("ITEMDATA IS===", textData);
        // return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
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

    Alert.alert("Agregar a tu inventario?", "new joint in ya book?", [
      {
        text: "No",
        onPress: () => {
          setModalVisible(!modalVisible);
          setScanned(false);
        },
      },
      {
        text: "Si",
        onPress: () => {
          console.log("ADDING TO BOOK and mode is", newMode);
          setTitle(newProduct);
          setPrice(newPrice);
          setCategory(newCategory);
          setSize(newSize);
          setCode(code);
          setBrand(newBrand);
          setNewMode(false);
        },
      },
    ]);

    // setModalVisible(false);
    // setTitle(true);

    setTimeout(() => {
      loadDetails();
    }, 1000);
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

  const uploadProduct = (
    Title,
    Price,
    Category,
    Quantity,
    Size,
    Brand,
    Code
  ) => {
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
          Brand,
          Code
        );

        dispatch(
          sendProduct.updateProducts(
            Title,
            Price,
            Category,
            Quantity,
            Size,
            Brand,
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
            Brand,
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
  let Brand;
  let Code;
  let alertQuantity;
  let result;

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    // console.log(availableProducts);
    const userQuantity = userProducts.find((prod) => prod.productcode === data);
    const loadedProduct = availableProducts.find((code) => code.code === data);

    if (data) {
      Code = data.toString();
      setCode(data);
    }

    if (loadedProduct) {
      setNewMode(false);
      console.log("THIS IS LOADED PRODUCT", loadedProduct);
      try {
        Title = loadedProduct.Product;
        Price = loadedProduct.Price;
        Category = loadedProduct.Category;
        Size = loadedProduct.Size;
        Brand = loadedProduct.Brand;
        Code = loadedProduct.code.toString();
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

    if (!sell && loadedProduct) {
      uploadProduct(Title, Price, Category, Quantity, Size, Brand, Code);
    }
    if (sell) {
      minusProduct(Title, Price, Category, Quantity, Size, Brand, Code);
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
    setBrand(Brand);
    setCode(Code);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (!scanner && !menu) {
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
        <View
          style={{
            // flex: 0.8,
            // height: "80%",
            marginBottom: 80,
            justifyContent: "center",
          }}
        >
          <Button
            icon={{
              // <Icon
              iconStyle: styles.menuIcon,
              name: "qr-code",
              size: 25,
              color: "white",
              // />
            }}
            iconRight
            buttonStyle={styles.menuButton}
            titleStyle={{
              fontSize: 25,
            }}
            title="Abrir Scanner"
            onPress={() => setScanner(true)}
          />
          <Button
            icon={{
              // <Icon
              iconStyle: styles.menuIcon,
              name: "list",
              size: 25,
              color: "white",
              // />
            }}
            iconRight
            buttonStyle={styles.menuButton}
            titleStyle={{
              fontSize: 25,
            }}
            title="Abrir Catálogo"
            onPress={() => setMenu(true)}
          />
          <Button
            icon={{
              // <Icon
              iconStyle: styles.menuIcon,
              name: "print",
              size: 25,
              color: "white",
              // />
            }}
            iconRight
            buttonStyle={styles.menuButton}
            titleStyle={{
              fontSize: 25,
            }}
            title="Exportar .PDF"
            onPress={() => setScanner(true)}
          />
        </View>
      </View>
    );
  }

  //////////////////////////
  //////////////////////////
  //////////////////////////
  //////////////////////////
  if (menu) {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={() => setMenu(false)}>
          <Text>Menu screen</Text>
        </TouchableOpacity>
        <View
          style={{
            // height: 50,
            // flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginBottom: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              marginTop: 25,
              paddingHorizontal: 15,
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setProductSelect(true);
                setCategorySelect(false);
                setBrandSelect(false);
                setFilteredDataSource([]);
              }}
            >
              {productSelect ? (
                <AntDesign name="checkcircle" size={24} color="white" />
              ) : (
                <Entypo name="circle" size={24} color="white" />
              )}
              <Text style={styles.menuSearch}> Producto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setCategorySelect(true);
                setProductSelect(false);
                setBrandSelect(false);
                setFilteredDataSource([]);
              }}
            >
              {categorySelect ? (
                <AntDesign name="checkcircle" size={24} color="white" />
              ) : (
                <Entypo name="circle" size={24} color="white" />
              )}
              <Text style={styles.menuSearch}> Categoria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setBrandSelect(true);
                setCategorySelect(false);
                setProductSelect(false);
                setFilteredDataSource([]);
              }}
            >
              {brandSelect ? (
                <AntDesign name="checkcircle" size={24} color="white" />
              ) : (
                <Entypo name="circle" size={24} color="white" />
              )}
              <Text style={styles.menuSearch}> Marca</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setBrandSelect(false);
                setCategorySelect(false);
                setProductSelect(true);
                setSearch("");
                setFilteredDataSource(userProducts);
              }}
            >
              <MaterialIcons name="clear" size={24} color="black" />
              <Text style={styles.menuSearch}> Aclarar</Text>
            </TouchableOpacity> */}
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundColor: "#fff",
                borderWidth: 0.5,
                borderColor: "#000",
                height: 40,
                borderRadius: 5,
                margin: 10,
                marginTop: 20,
                padding: 5,
                width: "80%",
              }}
            >
              <TextInput
                style={{ flex: 1 }}
                onFocus={() => {
                  setFocused(true);
                  setFilteredDataSource(userProducts);
                  setMasterDataSource(userProducts);
                }}
                clearButtonMode={"always"}
                // onBlur={() => {
                //   setFocused(false);
                // }}
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
                underlineColorAndroid="transparent"
                placeholder="Buscar"
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setManualAdd(true);
                }}
              >
                <FontAwesome name="plus-circle" size={35} color="#FF4949" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <KeyboardAvoidingView
          style={
            {
              // flex: 1,
            }
          }
          behavior={Platform.OS === "android" ? "padding" : "position"}
          keyboardVerticalOffset={-80}
          // style={styles.screen}
        >
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={manualAdd}
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
                          placeholder="Marca"
                          value={newBrand}
                          onChangeText={(brand) => {
                            setNewBrand(brand);
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
                        </TouchableOpacity>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={picker}
                          // onRequestClose={() => {
                          //   Alert.alert("Modal has been closed.");
                          // }}
                        >
                          <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                              <Picker
                                selectedValue={picked}
                                mode="dropdown"
                                style={{
                                  height: 30,
                                  marginTop: 20,
                                  marginBottom: 30,
                                  width: 200,
                                  justifyContent: "center",
                                }}
                                itemStyle={{ fontSize: 16 }}
                                onValueChange={(itemValue) =>
                                  setPicked(itemValue)
                                }
                              >
                                <Picker.Item
                                  label="Elige una Categoria"
                                  color="grey"
                                  value="N/A"
                                />
                                <Picker.Item label="Bebidas" value="Bebidas" />
                                <Picker.Item label="Sopa" value="Sopa" />
                                {/* <View></View> */}
                              </Picker>
                              <TouchableOpacity
                                style={{
                                  ...styles.openButton,
                                  backgroundColor: "pink",
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
                        </Modal>
                        {/* <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(text) => searchFilterFunction(text)}
                            value={search}
                            underlineColorAndroid="transparent"
                            placeholder="Buscar"
                          /> */}
                      </View>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.modalTextCode}>Codigo: </Text>
                      <Text style={styles.modalTextCodigo}>{code}</Text>
                    </View> */}
                    {/* <Text style={styles.modalText}>Codigo: {code}</Text> */}
                    {/* </View> */}
                    {/* //////////////////
//////////////////
//////////////////
////////////////// */}
                    {/* {title && (
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
                    )} */}

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
                          setManualAdd(!manualAdd);
                          // props.navigation.navigate("Home"),
                          setScanned(false);
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
                          if (newMode) {
                            newEntry();
                            console.log("theres a new product", newProduct);
                            continueScan();
                          }
                          if (!newMode) {
                            console.log("NEW PRODUCT ADDED now for inventory");
                            newInvProd();
                            setModalVisible(!modalVisible);
                            continueScan();
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
        <View style={{ flex: 1, marginBottom: 10 }}>
          <FlatList
            refreshControl={
              <RefreshControl
                colors={["#FF4949", "#FF4949"]}
                refreshing={isRefreshing}
                onRefresh={() => {
                  loadDetails();
                }}
              />
            }
            data={userProducts}
            numColumns={2}
            keyExtractor={(item) => item.productId}
            renderItem={(itemData) => (
              <CategoryGridTile
                title={itemData.item.productTitle}
                onSelect={() => {
                  alert("pressed");
                }}
                size={itemData.item.productSize}
                price={itemData.item.productPrice}
                category={itemData.item.productCategory}
                quantity={itemData.item.productQuantity}
                brand={itemData.item.productBrand}
                code={itemData.item.productcode}
                reload={() => {
                  loadDetails();
                }}
              />
            )}
          />
        </View>
      </View>
    );
  }

  ///////////////////////////
  /////////////////////////
  //////////////////////////
  /////////////////////////
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
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.modalText}>Marca: </Text>
                          <Text style={styles.modalText}>{brand}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.modalText}>Precio: </Text>
                          <Text style={styles.modalText}>${price}bs</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.modalText}>Tamaño: </Text>
                          <Text style={styles.modalText}>{size}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.modalText}>Categoria: </Text>
                          <Text style={styles.modalText}>{category}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.modalText}>Cantidad Total: </Text>
                          <Text style={styles.modalText}>{quantity}</Text>
                        </View>
                        {/* <Text style={styles.modalText}>Tamaño: {size}</Text>
                        <Text style={styles.modalText}>Marca: {brand}</Text>
                        <Text style={styles.modalText}>
                          Categoria: {category}
                        </Text>
                        <Text style={styles.modalText}>
                          Cantidad Total: {quantity}
                        </Text> */}
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
                            placeholder="Marca"
                            value={newBrand}
                            onChangeText={(brand) => {
                              setNewBrand(brand);
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
                          </TouchableOpacity>
                          <Modal
                            animationType="slide"
                            transparent={true}
                            visible={picker}
                            // onRequestClose={() => {
                            //   Alert.alert("Modal has been closed.");
                            // }}
                          >
                            <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                <Picker
                                  selectedValue={picked}
                                  mode="dropdown"
                                  style={{
                                    height: 30,
                                    marginTop: 20,
                                    marginBottom: 30,
                                    width: 200,
                                    justifyContent: "center",
                                  }}
                                  itemStyle={{ fontSize: 16 }}
                                  onValueChange={(itemValue) =>
                                    setPicked(itemValue)
                                  }
                                >
                                  <Picker.Item
                                    label="Elige una Categoria"
                                    color="grey"
                                    value="N/A"
                                  />
                                  <Picker.Item
                                    label="Bebidas"
                                    value="Bebidas"
                                  />
                                  <Picker.Item label="Sopa" value="Sopa" />
                                  {/* <View></View> */}
                                </Picker>
                                <TouchableOpacity
                                  style={{
                                    ...styles.openButton,
                                    backgroundColor: "pink",
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
                          </Modal>
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
                          // props.navigation.navigate("Home"),
                          setScanned(false);
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
                          if (newMode) {
                            newEntry();
                            console.log("theres a new product", newProduct);
                            continueScan();
                          }
                          if (!newMode) {
                            console.log("NEW PRODUCT ADDED now for inventory");
                            newInvProd();
                            setModalVisible(!modalVisible);
                            continueScan();
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
                brand={itemData.item.productBrand}
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

ScanScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Escanear",
  };
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    alignSelf: "center",
    height: 80,
    width: "90%",
    borderRadius: 12,
    backgroundColor: "#FF4949",
    marginVertical: 10,
    shadowColor: "#FF4949",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 1,
  },
  menuIcon: {
    marginLeft: 15,
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
