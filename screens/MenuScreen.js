import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  SectionList,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import { Avatar, Divider, Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import InputSpinner from "react-native-input-spinner";
import CategoryGridTile from "../components/CategoryGridTile";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import { useFocusEffect } from "@react-navigation/native";
import Moment from "moment";
import { extendMoment } from "moment-range";
import localization from "moment/locale/es-us";
import DateTimePicker from "react-native-modal-datetime-picker";
import { SearchableSectionList } from "react-native-searchable-list";

import { TouchableWithoutFeedback } from "react-native";
import Colors from "../constants/Colors";

const MenuScreen = (props) => {
  const { user, createProduct, editedProduct, deleteProduct } =
    useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [userProducts, setUserProducts] = useState();
  const [scanned, setScanned] = useState(false);
  const [manualAdd, setManualAdd] = useState(false);
  const [extendedDate, setExtendedDate] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [prompt, setPrompt] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [type, setType] = useState();
  const [newText, setNewText] = useState();
  const [placeholder, setPlaceholder] = useState();
  const [expDate, setExpDate] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [scanCount, setScanCount] = useState(0);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [size, setSize] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchAttribute, setSearchAttribute] = useState("Brand");
  const [quantity, setQuantity] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadedModal, setLoadedModal] = useState(false);
  const [newMode, setNewMode] = useState(true);
  const [loadedMode, setLoadedMode] = useState(false);
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
  const [hasCode, setHasCode] = useState(false);
  const [searchScreen, setSearchScreen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const moment = extendMoment(Moment);

  const fetchAvailableProducts = async () => {
    setIsRefreshing(true);
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Products")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { Product, Quantity, Category, Price, Brand, code, Size } =
              doc.data();
            list.push({
              productId: doc.id,
              Product,
              Price,
              Category,
              Quantity,
              Size,
              Brand,
              code,
            });
          });
        });
      setAvailableProducts(list);
      setIsRefreshing(false);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchPost = async () => {
    console.log("catalog userProducts loading");
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

  const catSections = [
    {
      title: catOptions[0],
      data: availableProducts.filter((cat) => cat.Category === catOptions[0]),
    },
    {
      title: catOptions[1],
      data: availableProducts.filter((cat) => cat.Category === catOptions[1]),
    },
    {
      title: catOptions[2],
      data: availableProducts.filter((cat) => cat.Category === catOptions[2]),
    },
    {
      title: catOptions[3],
      data: availableProducts.filter((cat) => cat.Category === catOptions[3]),
    },
    {
      title: catOptions[4],
      data: availableProducts.filter((cat) => cat.Category === catOptions[4]),
    },
    {
      title: catOptions[5],
      data: availableProducts.filter((cat) => cat.Category === catOptions[5]),
    },
    {
      title: catOptions[6],
      data: availableProducts.filter((cat) => cat.Category === catOptions[6]),
    },
    {
      title: catOptions[7],
      data: availableProducts.filter((cat) => cat.Category === catOptions[7]),
    },
    {
      title: catOptions[8],
      data: availableProducts.filter((cat) => cat.Category === catOptions[8]),
    },
    {
      title: catOptions[9],
      data: availableProducts.filter((cat) => cat.Category === catOptions[9]),
    },
    {
      title: catOptions[10],
      data: availableProducts.filter((cat) => cat.Category === catOptions[10]),
    },
    {
      title: catOptions[11],
      data: availableProducts.filter((cat) => cat.Category === catOptions[11]),
    },
    {
      title: catOptions[12],
      data: availableProducts.filter((cat) => cat.Category === catOptions[12]),
    },
    {
      title: catOptions[13],
      data: availableProducts.filter((cat) => cat.Category === catOptions[13]),
    },
    {
      title: catOptions[14],
      data: availableProducts.filter((cat) => cat.Category === catOptions[14]),
    },
    {
      title: "Sin Categoria",
      data: availableProducts.filter((cat) => cat.Category === catOptions[-1]),
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      const startAvailableProducts = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Products")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Product,
                  Quantity,
                  Category,
                  Price,
                  Brand,
                  code,
                  Size,
                } = doc.data();
                list.push({
                  productId: doc.id,
                  Product,
                  Price,
                  Category,
                  Quantity,
                  Size,
                  Brand,
                  code,
                });
              });
            });
          setAvailableProducts(list);
        } catch (e) {
          console.log(e);
        }
        // setIsLoading(false);
      };
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
      startAvailableProducts();
      setIsLoading(false);
    }, [])
  );

  const itemUpdateHandler = () => {
    console.log(
      "need to see these deets",
      newProduct,
      newSize,
      newPrice,
      newCategory,
      newBrand,
      quantity,
      expDate,
      code
    );
    if (type === "Title") {
      console.log("type is Title");
      setNewProduct(newText);
    }
    if (type === "Brand") {
      console.log("type is Brand");
      setNewBrand(newText);
    }
    if (type === "Price") {
      console.log("type is Price");
      setNewPrice(newText);
    }
    if (type === "Size") {
      console.log("type is Size");
      setNewSize(newText);
    }
  };

  const itemDeleteHandler = () => {
    Alert.alert(
      "Borrar producto?",
      `El producto ${newProduct} será borrado de tu inventario?`,
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
    console.log("code to delete", code);
    deleteProduct(code);
    setLoadedModal(false);
    setLoadedMode(false);
    fetchPost();
    fetchAvailableProducts();
  };
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        if (productSelect) {
          const itemData = item.Product
            ? item.Product.toUpperCase()
            : "".toUpperCase();
          const textData = text.toUpperCase();
          // console.log("ITEMDATA IS===", textData);
          return itemData.indexOf(textData) > -1;
        }
        if (categorySelect) {
          const itemData = item.Category
            ? item.Category.toUpperCase()
            : "".toUpperCase();
          const textData = text.toUpperCase();
          // console.log("ITEMDATA IS===", textData);
          return itemData.indexOf(textData) > -1;
        }
        if (brandSelect) {
          const itemData = item.Brand
            ? item.Brand.toUpperCase()
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
    if (!hasCode) {
      var randCode = Math.random().toString();
    }

    if (hasCode) {
      createProduct(newProduct, newSize, newPrice, newCategory, newBrand, code);
    }
    if (!hasCode) {
      createProduct(
        newProduct,
        newSize,
        newPrice,
        newCategory,
        newBrand,
        randCode
      );
    }
    console.log("going to test math random code", randCode);

    Alert.alert(
      "Agregar a tu inventario?",
      "Quisiera agregar el producto directo a tu inventario?",
      [
        {
          text: "No",
          onPress: () => {
            setManualAdd(!manualAdd);
            setModalVisible(!modalVisible);
            setNewBrand("");
            setNewProduct("");
            setNewPrice("");
            setNewSize("");
            setNewCategory("");
            setCode("");
            setQuantity(0);
            fetchPost();
            fetchAvailableProducts();
          },
        },
        {
          text: "Si",
          onPress: () => {
            setManualAdd(!manualAdd);
            setModalVisible(!modalVisible);
            setLoadedModal(true);
            setCode(!hasCode ? randCode : code);
            setNewMode(false);
          },
        },
      ]
    );

    // setModalVisible(false);
    // setTitle(true);

    // fetchAvailableProducts();
  };

  const codePrompt = () => {
    Alert.alert("Nuevo Producto", "Este producto tiene un código de barras?", [
      {
        text: "No",
        onPress: () => {
          setHasCode(false);
          setNewMode(true);
          setManualAdd(true);
        },
      },
      {
        text: "Si",
        onPress: () => {
          setHasCode(true);
          setNewMode(true);
          setManualAdd(true);
        },
      },
    ]);
  };

  const dateHandler = useCallback(async (date) => {
    setExtendedDate(false);
    var dateChanged = moment(date).format("YYYYMMDD");
    setExpDate(dateChanged);
  });

  const newInvProd = () => {
    editedProduct(
      newBrand,
      newProduct,
      newPrice,
      newSize,
      newCategory,
      quantity,
      expDate,
      code
    );
    setLoadedMode(false);
    setLoadedModal(false);
    setPrompt("");
    setType();
    setPlaceholder("");
    setNewText();
    setNewBrand("");
    setNewProduct("");
    setNewPrice("");
    setNewSize("");
    setNewCategory("");
    setQuantity(0);
    fetchPost();
    fetchAvailableProducts();
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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <View>
          <ActivityIndicator size="large" color="#FF4949" />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
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
            height: 33,
            borderRadius: 20,
            margin: 11,
            marginTop: 20,
            padding: 5,
            width: "80%",
          }}
        >
          <TextInput
            style={{ flex: 1 }}
            // onFocus={() => {
            //   setSearchScreen(true);
            //   // setFocused(true);
            //   // setFilteredDataSource(availableProducts);
            //   // setMasterDataSource(availableProducts);
            // }}
            clearButtonMode={"always"}
            // onBlur={() => {
            //   setFocused(false);
            // }}
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
            // underlineColorAndroid="transparent"
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
              codePrompt();
            }}
          >
            <FontAwesome name="plus-circle" size={35} color="#FF4949" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={
          {
            // flex: 1,
          }
        }
        behavior={"padding"}
        keyboardVerticalOffset={80}
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
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setManualAdd(!manualAdd);
                        setNewBrand("");
                        setNewProduct("");
                        setNewPrice("");
                        setNewSize("");
                        setNewCategory("");
                        setCode("");
                        setQuantity(0);
                      }}
                      style={{
                        marginRight: 25,
                        shadowColor: "black",
                        shadowOffset: {
                          width: 0,
                          height: 5,
                        },
                        shadowOpacity: 0.15,
                        // shadowRadius: 9.84,
                        elevation: 0,
                      }}
                    >
                      <Ionicon
                        name="close-circle-outline"
                        size={44}
                        color="black"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        newEntry();
                        console.log(
                          "theres a new available product",
                          newProduct
                        );
                        // continueScan();
                      }}
                    >
                      <Text style={{ color: "blue", fontSize: 20 }}>
                        Guardar
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>Nuevo Producto</Text>
                    <View style={{ alignItems: "center", width: "100%" }}>
                      <TextInput
                        style={styles.textInputStyle}
                        placeholder="Producto"
                        placeholderTextColor="grey"
                        value={newProduct}
                        onChangeText={(name) => {
                          setNewProduct(name);
                        }}
                      />
                      <TextInput
                        style={styles.textInputStyle}
                        placeholder="Marca"
                        placeholderTextColor="grey"
                        value={newBrand}
                        onChangeText={(brand) => {
                          setNewBrand(brand);
                        }}
                      />
                      <TextInput
                        style={styles.textInputStyle}
                        keyboardType="numeric"
                        placeholder="Precio"
                        placeholderTextColor="grey"
                        value={newPrice}
                        onChangeText={(price) => {
                          setNewPrice(price);
                        }}
                      />
                      <TextInput
                        style={styles.textInputStyle}
                        placeholder="Tomaño"
                        placeholderTextColor="grey"
                        value={newSize}
                        onChangeText={(size) => {
                          setNewSize(size);
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setPicker(true);
                        }}
                      >
                        <Text style={[styles.modalText, { marginBottom: 15 }]}>
                          Categoria: {newCategory}
                        </Text>
                        {/* {!showPicker && ( */}
                        <Text
                          style={{
                            fontSize: 12,
                            color: "silver",
                            alignSelf: "center",
                          }}
                        >
                          Mostrar opciones
                        </Text>
                        {/* )} */}
                      </TouchableOpacity>

                      {/* <View style={styles.modalView}> */}
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
                      {/* <TouchableOpacity
                        style={{
                          ...styles.openButton,
                          backgroundColor: Colors.primary,
                          marginTop: 45,
                        }}
                        onPress={() => {
                          setNewCategory(picked);
                          setPicker(false);
                        }}
                      >
                        <Text style={styles.textStyle}>Guardar</Text>
                      </TouchableOpacity> */}
                      {/* </View> */}

                      {hasCode && (
                        <TextInput
                          style={styles.textInputStyle}
                          keyboardType="numeric"
                          placeholder="Código de barras"
                          value={code}
                          onChangeText={(codigo) => {
                            setCode(codigo);
                          }}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </KeyboardAvoidingView>

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
            visible={loadedModal}
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
                          <Text style={styles.modalEdit}>{prompt}</Text>
                          <TextInput
                            style={styles.textInputStyle}
                            clearButtonMode={"always"}
                            underlineColorAndroid="transparent"
                            placeholder={placeholder}
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
                                backgroundColor: Colors.primary,
                              }}
                              onPress={() => {
                                setPrompt("");
                                setType();
                                setPlaceholder("");
                                setNewText();
                                setEditVisible(!editVisible);
                              }}
                            >
                              <Text style={styles.textStyle}>Volver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                ...styles.openButton,
                                backgroundColor: Colors.primary,
                              }}
                              onPress={() => {
                                itemUpdateHandler();
                                setPrompt("");
                                setType();
                                setPlaceholder("");
                                setNewText();
                                setEditVisible(!editVisible);
                              }}
                            >
                              <Text style={styles.textStyle}>Guardar</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setPrompt("Titulo");
                        setType("Title");
                        setPlaceholder(newProduct);
                        setEditVisible(true);
                      }}
                    >
                      <Text style={styles.modalTitle}>
                        Producto para editar:
                      </Text>
                      <Text style={styles.modalHead}>{newProduct}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalItemBorderCategoria}
                      onPress={() => {
                        setPrompt("Tamaño");
                        setType("Size");
                        setPlaceholder(newSize);
                        setEditVisible(true);
                      }}
                    >
                      <Text style={styles.modalTextTitle}>Tamaño: </Text>
                      <Text style={styles.modalText}>{newSize}</Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.modalItemBorder}
                        onPress={() => {
                          setPrompt("Marca");
                          setType("Brand");
                          setPlaceholder(newBrand);
                          setEditVisible(true);
                        }}
                      >
                        <Text style={styles.modalTextTitle}>Marca: </Text>
                        <Text style={styles.modalText}>{newBrand}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalItemBorder}
                        onPress={() => {
                          setPrompt("Precio");
                          setType("Price");
                          setPlaceholder(newPrice.toString());
                          setEditVisible(true);
                        }}
                      >
                        <Text style={styles.modalTextTitle}>Precio: </Text>
                        <Text style={styles.modalText}>${newPrice}bs</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.modalItemBorderCategoria}
                      onPress={() => {
                        setPrompt("Categoria");
                        setType("Category");
                        setPicker(true);
                      }}
                    >
                      <Text style={styles.modalTextTitle}>Categoria: </Text>
                      <Text style={styles.modalText}>{newCategory}</Text>
                    </TouchableOpacity>

                    {/* ///////////
///////////
///////////
///////////
///////////
///////////
/////////// */}

                    <View style={styles.modalItemBorderCategoria}>
                      <TouchableOpacity
                        onPress={() => {
                          setExtendedDate(true);
                        }}
                      >
                        <Text style={styles.modalTextTitle}>Fecha de Exp:</Text>
                        <Text style={styles.modalText}>
                          {moment(expDate)
                            .locale("es", localization)
                            .format("LL")}
                        </Text>
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

                      {extendedDate && (
                        <View>
                          <DateTimePicker
                            mode="date"
                            isVisible={extendedDate}
                            locale="es-ES"
                            date={selectedDate}
                            onConfirm={
                              (date) => {
                                setSelectedDate(date);
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

                    {/* //////////////////////////////
                    //////////////////
                    ///////
                    //////////////////////////////
                    ////////////////// */}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.modalTextCode}>Codigo: </Text>
                    <Text style={styles.modalTextCodigo}>{code}</Text>
                  </View>
                  <KeyboardAvoidingView
                    keyboardVerticalOffset={30}
                    behavior={"padding"}
                    style={[
                      styles.modalItemBorderCategoria,
                      { marginBottom: 20 },
                    ]}
                  >
                    <Text style={styles.modalTextTitle}>Cantidad: </Text>

                    <InputSpinner
                      max={10000}
                      min={0}
                      step={1}
                      fontSize={20}
                      onMax={(max) => {
                        Alert.alert("llego al Maximo", "El maximo seria 1000");
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
                          setQuantity(num);
                        }
                      }}
                    />
                    <Text style={styles.quantitySelect}>Entrar cantidad</Text>
                  </KeyboardAvoidingView>
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
                        backgroundColor: Colors.primary,
                      }}
                      onPress={() => {
                        setLoadedModal(false);
                        setLoadedMode(false);
                      }}
                    >
                      <Text style={styles.textStyle}>Cerrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.openButton,
                        backgroundColor: Colors.primary,
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
                        backgroundColor: Colors.primary,
                      }}
                      onPress={() => {
                        newInvProd();
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

      <View style={{ flex: 1, marginBottom: 30 }}>
        <SearchableSectionList
          refreshing={isRefreshing}
          onRefresh={() => {
            fetchAvailableProducts();
            fetchPost();
          }}
          searchTerm={searchTerm}
          searchAttribute={searchAttribute}
          ignoreCase={true}
          searchByTitle={false}
          initialNumToRender={10}
          sections={catSections}
          keyExtractor={(item, index) => item + index}
          stickySectionHeadersEnabled={true}
          // keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryGridTile
              title={item.Product}
              size={item.Size}
              price={item.Price}
              category={item.Category}
              quantity={item.Quantity}
              brand={item.Brand}
              code={item.code}
              userProducts={userProducts}
              reload={() => {
                fetchAvailableProducts();
                fetchPost();
              }}
            />
          )}
          renderSectionHeader={({ section }) => (
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.sectionHeaderStyle}>{section.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default MenuScreen;

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
    elevation: 0,
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
  centered: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: Colors.primary,
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
    marginBottom: 2,
    textAlign: "center",
    fontSize: 22,
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
  quantitySelect: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 17,
    color: "silver",
  },
  modalHead: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4949",
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  modalTextTitle: {
    // marginBottom: 2,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalEdit2: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    // fontWeight: "bold",
  },
  modalEdit: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTextCode: {
    color: "grey",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "left",
    fontSize: 20,
  },
  textInputStyleEdit: {
    height: 40,
    width: "70%",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    borderColor: "black",
    backgroundColor: "#FFFFFF",
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
    width: 200,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
    borderColor: "black",
    backgroundColor: "#FFFFFF",
  },
  sectionHeaderStyle: {
    backgroundColor: "#CBBDBD",
    fontSize: 25,
    fontWeight: "bold",
    padding: 5,
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    left: 15,
  },
});
