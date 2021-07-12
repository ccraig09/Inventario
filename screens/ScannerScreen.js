import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Platform,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  SectionList,
  ActivityIndicator,
  LogBox,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector, useDispatch } from "react-redux";
import * as sendProduct from "../store/productActions";
import CartItemQuick from "../models/cart-item";

import * as ProdActions from "../store/productActions";
import ProductItem from "../components/ProductItem";
import { FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import InputSpinner from "react-native-input-spinner";
import { BarCodeScanner } from "expo-barcode-scanner";
import DropDownPicker from "react-native-dropdown-picker";
import { TouchableWithoutFeedback } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DateTimePicker from "react-native-modal-datetime-picker";
// import moment from "moment";
import Moment from "moment";
import localization from "moment/locale/es-us";
import "moment/locale/es";
import { extendMoment } from "moment-range";
import * as cartActions from "../store/cartAction";
import Card from "../components/Card";
import CartItem from "../components/CartItem";
import Colors from "../constants/Colors";
import { Audio } from "expo-av";
import { AuthContext } from "../navigation/AuthProvider";
import firebase from "../components/firebase";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const ScannerScreen = ({ navigation }) => {
  const height = Dimensions.get("window").height * 0.3;
  const width = Dimensions.get("window").width;

  const { user, createProduct, editedProduct } = useContext(AuthContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [itemExist, setItemExist] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [prompt, setPrompt] = useState();
  const [type, setType] = useState();
  const [newText, setNewText] = useState();
  const [placeholder, setPlaceholder] = useState();
  const [extendedDate, setExtendedDate] = useState(false);
  const [expDate, setExpDate] = useState();
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
  const [quickMode, setQuickMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadedModal, setLoadedModal] = useState(false);
  const [newQ, setNewQ] = useState();
  const [newMode, setNewMode] = useState(false);
  const [editPriceModal, setEditPriceModal] = useState(false);
  const [editedPrice, setEditedPrice] = useState();
  const [loadedMode, setLoadedMode] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [picker, setPicker] = useState(false);
  const [newQuickPrice, setNewQuickPrice] = useState();
  const [newQuickProduct, setNewQuickProduct] = useState();
  const [quickAdd, setQuickAdd] = useState(false);
  const [picked, setPicked] = useState();
  const [selectedId, setSelectedId] = useState();
  const [dropMode, setDropMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(null);
  const [quickProducts, setQuickProducts] = useState([]);
  const [items, setItems] = useState();
  const [sound, setSound] = React.useState();
  const [checkoutModal, setCheckoutModal] = useState(false);
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const moment = extendMoment(Moment);

  const dateHandler = useCallback(async (date) => {
    setExtendedDate(false);
    var dateChanged = moment(date).format("YYYYMMDD");
    setExpDate(dateChanged);
  });

  const fetchProducts = async () => {
    // setError(null);
    // console.log("refreshing");
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Members")
        .doc(user.uid)
        .collection("Member Products")
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
              isChecked,
            } = doc.data();
            list.push({
              productId: doc.id,
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
              isChecked: isChecked,
            });
          });
        });
      setUserProducts(list);
      setItems(
        list.map((dropItems) => ({
          key: dropItems.productId,
          label: dropItems.productTitle,

          value: dropItems.productId,
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };
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
              productTitle: Product,
              productPrice: Price,
              productCategory: Category,
              productQuantity: Quantity,
              productSize: Size,
              productBrand: Brand,
              productcode: code,
              docTitle: doc.id,
              isChecked: false,
            });
          });
        });
      setAvailableProducts(list);
      setIsRefreshing(false);
    } catch (e) {
      console.log(e);
    }
  };

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
        isChecked: state.cart.items[key].isChecked,
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

  useEffect(() => {
    // loadDetails();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
      fetchAvailableProducts();
      continueScan();
      return () => fetchProducts(), fetchAvailableProducts(), continueScan();
    }, [])
  );

  const modeHandler = () => {
    setSell((prevState) => !prevState);
  };

  const itemUpdateHandler = () => {
    console.log(
      "need to see these deets for editing product",
      brand,
      title,
      price,
      size,
      category,
      quantity,
      expDate,
      code
    );

    if (type === "Title") {
      console.log("type is Title");
      setTitle(newText);
    }
    if (type === "Brand") {
      console.log("type is Brand");
      setBrand(newText);
    }
    if (type === "Price") {
      console.log("type is Price");
      setPrice(newText);
    }
    if (type === "Size") {
      console.log("type is Size");
      setSize(newText);
    }
    // if (type === "Marca") {
    //   console.log("type is Marca");
    //   dispatch(sendProduct.brandUpdate(newText, code));
    // }
    // if (type === "Precio") {
    //   console.log("type is Precio");
    //   dispatch(sendProduct.priceUpdate(newText, code));
    // }
    // if (type === "Tomaño") {
    //   console.log("type is Tomaño");
    //   dispatch(sendProduct.sizeUpdate(newText, code));
    // }
    // if (type === "Categoria") {
    //   console.log("type is Categoria");
    //   dispatch(sendProduct.categoryUpdate(newText, code));
    // }
    // setNewText();
    // setTimeout(() => {
    //   props.reload();
    // }, 1000);
  };

  const newEntry = () => {
    createProduct(newProduct, newSize, newPrice, newCategory, newBrand, code);

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
            setNewProduct();
            setNewPrice();
            setNewCategory();
            setNewSize();
            setNewBrand();
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
            setNewProduct();
            setNewPrice();
            setNewCategory();
            setNewSize();
            setNewBrand();
          },
        },
      ]
    );
    fetchAvailableProducts();
    fetchProducts();

    // setModalVisible(false);
    // setTitle(true);

    // setTimeout(() => {
    //   loadDetails();
    // }, 1000);
  };

  const newInvProd = () => {
    editedProduct(brand, title, price, size, category, quantity, expDate, code);
    fetchAvailableProducts();
    fetchProducts();
    setLoadedMode(false);
    setPrompt("");
    setType();
    setPlaceholder("");
    setNewText();
    continueScan();
    setModalVisible(false);
  };

  const continueScan = () => {
    isFocused ? setScanned(false) : setScanned(true);
    // setScannedr(false);
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
    console.log("Ready to get it started", cartItems);

    // DISPATCH(REMOVE ALL)
    setIsLoading(true);
    await dispatch(sendProduct.createOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
    Alert.alert(
      "Transacción anotada",
      `usted puede continuar o actualizar su inventario`,
      [
        {
          text: "Continuar",
          style: "cancel",
          onPress: () => {
            setScanned(false);
            setCheckoutModal(false);
            //set cart items to 0
          },
        },
        {
          text: "Actualizar",
          onPress: () => {
            setScanned(false);
            navigation.navigate("Pedidos");
            setCheckoutModal(false);
          },
        },
      ]
    );
  };

  const changePriceHandler = () => {
    console.log("loading selectedId", selectedId);
    let newTax = parseInt(editedPrice);
    const userProduct = userProducts.find(
      (code) => code.productcode === selectedId
    );
    const nonUserProduct = availableProducts.find(
      (code) => code.productcode === selectedId
    );
    const nonRegProduct = quickProducts.find(
      (code) => code.productcode === selectedId
    );

    if (userProduct) {
      console.log("editing price for userProduct", userProduct);

      if (editMode) {
        if (
          cartItems.find((code) => code.productId != selectedId) ||
          cartItems.length == 0
        ) {
          console.log("editing price with no prior need to delete");
          Object.assign((userProduct.productPrice = newTax));
          dispatch(cartActions.addToCart(userProduct));
          setValue(null);
          setEditMode(false);
        }
        if (cartItems.find((code) => code.productId === selectedId)) {
          console.log("gotta delete sumn first");
          dispatch(cartActions.completeRemoveFromCart(userProduct.productId));
          Object.assign((userProduct.productPrice = newTax));
          dispatch(cartActions.addToCart(userProduct));
          setValue(null);
          setEditMode(false);
        }
      }

      // dispatch(cartActions.editCart(userProduct, newTax));
    }
    if (nonUserProduct && !userProduct) {
      console.log("editing price for nonUserProduct");
      if (editMode) {
        Object.assign((nonUserProduct.productPrice = newTax));
        dispatch(cartActions.addToCart(nonUserProduct));
        setValue(null);
        setEditMode(false);
      } else {
        dispatch(cartActions.addToCart(nonUserProduct));
        setValue(null);
      }
    }
    if (!nonUserProduct && !userProduct) {
      console.log("editing price for nonREGProduct");

      if (editMode) {
        console.log("checking non reg", nonRegProduct);
        Object.assign((nonRegProduct.productPrice = newTax));
        dispatch(cartActions.addToCart(nonRegProduct));
        setValue(null);
        setEditMode(false);
      } else {
        dispatch(cartActions.addToCart(nonRegProduct));
        setValue(null);
      }
    }
  };

  const editPrice = (id) => {
    setEditPriceModal(true);
    setSelectedId(id);
  };

  const addUp = (id) => {
    const userProduct = userProducts.find((code) => code.productcode === id);
    const nonUserProduct = availableProducts.find(
      (code) => code.productcode === id
    );
    const nonRegProduct = quickProducts.find(
      (code) => code.productcode === selectedId
    );
    if (userProduct) {
      console.log("adding up inside normal cart");

      dispatch(cartActions.addToCart(userProduct));
    }
    if (quickMode) {
      console.log("we in a hurry");

      const quickyArray = [
        {
          quantity: 1,
          productPrice: parseInt(newQuickPrice),
          productTitle: newQuickProduct,
          productPrice: parseInt(newQuickPrice),
          isChecked: false,
          productcode: selectedId,
          productId: selectedId,
        },
      ];
      console.log("loading quickies", quickyArray);

      const quickUserProduct = quickyArray.find(
        (code) => code.productcode === selectedId
      );
      console.log("did anything work??", quickUserProduct);
      dispatch(cartActions.addToCart(quickUserProduct));
      setQuickProducts((quickProducts) =>
        quickProducts.concat(quickUserProduct)
      );
      setQuickMode(false);
    }
    if (nonRegProduct && !nonUserProduct && !userProduct) {
      console.log("aigh hold on adding non non prod", quickProducts);
      const quickUserProduct = quickProducts.find(
        (code) => code.productcode === id
      );
      dispatch(cartActions.addToCart(quickUserProduct));
    }

    // if (nonUserProduct) {
    //   console.log("adding up NON USER PROD to normal cart");

    //   dispatch(cartActions.addToCart(nonUserProduct));
    // }
  };

  const handleBarCodeScannedSelected = async (value) => {
    setSelectedId(value);
    console.log("testing drop item selected", value);
    const userProduct = userProducts.find((code) => code.productcode === value);
    if (userProduct) {
      console.log("SELECTED something to sell");
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
      Alert.alert(
        "Producto Elegido",
        `${userProduct.productTitle} ${userProduct.productPrice}bs`,
        [
          {
            text: "Continuar",
            style: "cancel",
            onPress: async () => {
              setEditMode(false);
              setScanned(false);
              await dispatch(cartActions.addToCart(userProduct));
              setValue(null);
            },
          },
          {
            text: "Edit Price",
            style: "cancel",
            onPress: () => {
              setEditedPrice();
              setEditMode(true);
              setScanned(false);
              setEditPriceModal(true);
            },
          },
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {
              setScanned(false);
              setValue(null);
            },
          },
        ]
      );
    }
  };

  const handleBarCodeScannedSell = async ({ data }) => {
    setScanned(true);
    setSelectedId(data);
    console.log(data);
    const nonUserProduct = availableProducts.find(
      (cod) => cod.productcode === data
    );
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
      Alert.alert(
        "Producto Escaneado",
        `${userProduct.productTitle} ${userProduct.productPrice}bs`,
        [
          {
            text: "Continuar",
            style: "cancel",
            onPress: async () => {
              setEditMode(false);
              setScanned(false);
              await dispatch(cartActions.addToCart(userProduct));
            },
          },
          {
            text: "Edit Price",
            style: "cancel",
            onPress: () => {
              setEditedPrice();
              setEditMode(true);
              setScanned(false);
              setEditPriceModal(true);
            },
          },
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {
              setScanned(false);
            },
          },
        ]
      );
    }
    if (nonUserProduct && !userProduct) {
      console.log("Product is not registerd to user, but is avaiable");
      async function playSound() {
        console.log("Loading Sound");
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/tone.mp3")
        );
        setSound(sound);

        console.log("Playing Sound");
        await sound.playAsync();
      }
      playSound();
      Alert.alert(
        "Producto no esta registrado",
        `Puedes agregar el producto despues la transacción, ${nonUserProduct.productTitle} ${nonUserProduct.productPrice}bs`,
        [
          {
            text: "Continuar",
            style: "cancel",
            onPress: async () => {
              setEditMode(false);
              setScanned(false);
              await dispatch(cartActions.addToCart(nonUserProduct));
            },
          },
          {
            text: "Edit Price",
            style: "cancel",
            onPress: () => {
              setEditedPrice();
              setEditMode(true);
              setScanned(false);
              setEditPriceModal(true);
            },
          },
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => {
              setScanned(false);
            },
          },
        ]
      );
    }
    if (!nonUserProduct && !userProduct) {
      console.log("item not registered to owner nor in catalog");
      async function playSound() {
        console.log("Loading Sound");
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/errorBeep.mp3")
        );
        setSound(sound);

        console.log("Playing Sound");
        await sound.playAsync();
      }
      playSound();
      Alert.alert(
        "Producto Escaneado",
        `Este producto no esta registrado en el base de datos, ${data}`,
        [
          {
            text: "Continuar sin vender",
            style: "cancel",
            onPress: () => {
              setScanned(false);
            },
          },
          {
            text: "Editar y vender",
            style: "cancel",
            onPress: () => {
              setSelectedId(data);
              setNewQuickPrice();
              setNewQuickProduct();
              setQuickMode(true);
              setQuickAdd(true);
              setScanned(false);
            },
          },
        ]
      );
      // await dispatch(cartActions.addToCart(userProduct));
    }

    // console.log("these are scanned products", cartItems);
    // const scannedUserProduct = cartItems.find(
    //   (code) => code.productcode === data
    // );
    // setScannedResults(cartItems);

    // console.log(
    //   "THIS SHOULD BE scanneduserproduct",
    //   scannedUserProduct.quantity
    // );
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const userQuantity = userProducts.find((prod) => prod.productcode === data);
    const loadedProduct = availableProducts.find((cod) => cod.code === data);
    const userProduct = userProducts.find((code) => code.productcode === data);

    if (data) {
      Code = data.toString();
      setCode(data);
    }

    if (typeof loadedProduct === "undefined") {
      setNewMode(true);
      setLoadedMode(false);
      setItemExist(false);
    }

    if (loadedProduct && !userProduct) {
      console.log("item exist but is not in user inventory");
      setItemExist(true);
      setNewMode(false);
      setNewMode(false);

      try {
        Title = loadedProduct.Product;
        Price = loadedProduct.Price;
        Category = loadedProduct.Category;
        Size = loadedProduct.Size;
        Brand = loadedProduct.Brand;
        Code = loadedProduct.code.toString();
        console.log("THIS IS FIRST CODE TEST", Code);

        setCode(Code);
      } catch (err) {
        setError(err.message);
      }
    }

    if (userProduct) {
      setLoadedMode(true);
      setItemExist(false);
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
    // if (sell) {
    //   minusProduct(Title, Price, Category, Quantity, Size, Brand, Code);
    // }

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
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "position"}
        keyboardVerticalOffset={80}
        // style={styles.screen}
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
              Modo: {sell ? "Vender" : "Inventario"}
            </Text>
            <Text style={{ color: "silver" }}>
              cambiar a {!sell ? "Vender" : "Inventario"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDropMode((prevState) => !prevState);
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
                color: dropMode ? "blue" : "green",
              }}
            >
              Modo: {dropMode ? "Menu" : "Escaner"}
            </Text>
            <Text style={{ color: "silver" }}>
              cambiar a {!dropMode ? "Menu" : "Escaner"}
            </Text>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={quickAdd}
          onRequestClose={() => {
            setQuickAdd(!quickAdd);
          }}
        >
          <KeyboardAvoidingView
            style={{
              flex: 1,
              marginBottom: 100,
            }}
            behavior={"padding"}
            keyboardVerticalOffset={30}
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
                        placeholderTextColor="silver"
                        value={newQuickProduct}
                        onChangeText={(name) => {
                          setNewQuickProduct(name);
                        }}
                      />

                      <TextInput
                        style={styles.textInputStyle}
                        keyboardType="numeric"
                        placeholderTextColor="silver"
                        placeholder="Precio"
                        value={newQuickPrice}
                        onChangeText={(price) => {
                          setNewQuickPrice(price);
                        }}
                      />
                    </View>
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
                        setNewQuickPrice();
                        setNewQuickProduct();
                        setQuickAdd(!quickAdd);
                      }}
                    >
                      <Text style={styles.textStyle}>Cerrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.openButton,
                        backgroundColor: "#2196F3",
                      }}
                      onPress={() => {
                        addUp();
                        setQuickAdd(!quickAdd);
                      }}
                    >
                      <Text style={styles.textStyle}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={editPriceModal}
          onRequestClose={() => {
            setEditPriceModal(!editPriceModal);
          }}
        >
          <KeyboardAvoidingView
            style={{
              flex: 1,
              marginBottom: 100,
            }}
            behavior={"padding"}
            keyboardVerticalOffset={30}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalEdit2}>Editar Precio:</Text>
                  <TextInput
                    style={styles.textInputStyleEdit}
                    keyboardType={"numeric"}
                    clearButtonMode={"always"}
                    underlineColorAndroid="transparent"
                    // placeholder={placeholder}
                    onChangeText={(text) => setEditedPrice(text)}
                    value={editedPrice}
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
                        setEditedPrice();
                        setEditPriceModal(!editPriceModal);
                      }}
                    >
                      <Text style={styles.textStyle}>Cerrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        ...styles.openButton,
                        backgroundColor: "#2196F3",
                      }}
                      onPress={() => {
                        changePriceHandler();
                        setEditPriceModal(!editPriceModal);
                      }}
                    >
                      <Text style={styles.textStyle}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>

        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={checkoutModal}
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
                    <Text style={styles.modalTitleSell}>Total:</Text>
                    <Text style={styles.modalHeadSell}>
                      {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}bs
                    </Text>

                    <View style={{ height: 300 }}>
                      <ScrollView>
                        <View flex={1} onStartShouldSetResponder={() => true}>
                          <FlatList
                            data={cartItems}
                            keyExtractor={(item) => item.productId}
                            renderItem={(itemData) => (
                              <CartItem
                                quantity={itemData.item.quantity}
                                title={itemData.item.productTitle}
                                amount={itemData.item.sum}
                                // deletable
                                // onRemove={() => {
                                //   dispatch(
                                //     cartActions.removeFromCart(
                                //       itemData.item.productId
                                //     )
                                //   );
                                // }}
                              />
                            )}
                          />
                        </View>
                      </ScrollView>
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            ...styles.openButton,
                            backgroundColor: "#FF4949",
                          }}
                          onPress={() => {
                            setCheckoutModal(false);
                            setScanned(false);
                          }}
                        >
                          <Text style={styles.textStyle}>Modificar</Text>
                        </TouchableOpacity>
                        {isLoading ? (
                          <ActivityIndicator
                            size="small"
                            color={Colors.primary}
                          />
                        ) : (
                          <TouchableOpacity
                            style={{
                              ...styles.openButton,
                              backgroundColor: "#FF4949",
                            }}
                            onPress={() => {
                              console.log("Listo, sale complete");
                              continueScan();
                              setQuickProducts();
                              sendOrderHandler();
                            }}
                          >
                            <Text style={styles.textStyle}>Listo!</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <View
          style={{
            height: height,
            width: width,
            marginBottom: 5,
          }}
        >
          {dropMode ? (
            <DropDownPicker
              placeholder="Elige un producto"
              searchable={true}
              labelStyle={{
                fontWeight: "bold",
              }}
              onChangeValue={(value) => {
                // console.log(value);
                handleBarCodeScannedSelected(value);
              }}
              searchPlaceholder="Buscar..."
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
          ) : (
            <BarCodeScanner
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScannedSell}
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </View>

        <Card style={styles.summary}>
          <Text style={styles.summaryText}>
            Total:{" "}
            <Text style={styles.amount}>
              {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}bs
              {/* {cartTotalAmount}jjav */}
            </Text>
          </Text>

          <Button
            color={Colors.primary}
            title="Cobrar"
            disabled={cartItems.length === 0}
            // onPress={sendOrderHandler}
            onPress={() => {
              setCheckoutModal(true);
            }}
          />
        </Card>
        <View>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.productId}
            renderItem={(itemData) => (
              <CartItem
                quantity={itemData.item.quantity}
                title={itemData.item.productTitle}
                prodId={itemData.item.productId}
                amount={itemData.item.sum}
                deletable
                userProd={userProducts}
                addable
                onPriceEdit={() => {
                  setEditedPrice();
                  setEditMode(true);
                  editPrice(itemData.item.productId);
                }}
                onAdd={() => {
                  addUp(itemData.item.productId);
                }}
                onRemove={() => {
                  dispatch(cartActions.removeFromCart(itemData.item.productId));
                }}
                onLongRemove={() => {
                  Alert.alert(`Borrar ${itemData.item.productTitle}?`, "", [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Sí",
                      onPress: () =>
                        dispatch(
                          cartActions.completeRemoveFromCart(
                            itemData.item.productId
                          )
                        ),
                    },
                  ]);
                }}
              />
            )}
          />
          <View style={{ marginTop: 15 }}>
            {cartItems.length > 0 && (
              <Button
                color={Colors.primary}
                title="Borrar Todo"
                style={{ marginTop: 10 }}
                // onPress={sendOrderHandler}
                onPress={() => {
                  Alert.alert(`Borrar todo?`, "", [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Sí",
                      onPress: () => {
                        dispatch(sendProduct.removeAll()), setQuickProducts([]);
                      },
                    },
                  ]);
                }}
              />
            )}
            {cartItems.length == 0 && cartTotalAmount != 0 && (
              <Button
                color={Colors.primary}
                title="Borrar Total"
                style={{ marginTop: 10 }}
                // onPress={sendOrderHandler}
                onPress={() => {
                  Alert.alert(`Borrar Total?`, "", [
                    {
                      text: "No",
                      style: "cancel",
                    },
                    {
                      text: "Sí",
                      onPress: () => dispatch(sendProduct.removeAll()),
                    },
                  ]);
                }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (!sell) {
    return (
      <View
        style={{
          flex: 1,
          marginBottom: 50,
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
            <Text style={{ color: "silver" }}>
              cambiar a {!sell ? "Vender" : "Inventario"}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
          }}
          // behavior={Platform.OS === "android" ? "padding" : "position"}
          // keyboardVerticalOffset={-80}
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
              <KeyboardAvoidingView
                style={{
                  flex: 1,
                  marginBottom: 100,
                }}
                behavior={"padding"}
                keyboardVerticalOffset={30}
                // style={styles.screen}

                // marginTop: 40,
                // flexDirection: "column",
                // justifyContent: "flex-end",
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
                        <KeyboardAvoidingView
                          style={{
                            flex: 1,
                            marginBottom: 100,
                          }}
                          behavior={"padding"}
                          keyboardVerticalOffset={30}
                          // style={styles.screen}

                          // marginTop: 40,
                          // flexDirection: "column",
                          // justifyContent: "flex-end",
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
                                  style={styles.textInputStyleEdit}
                                  keyboardType={
                                    type === "Price" ? "numeric" : "default"
                                  }
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
                                      backgroundColor: "green",
                                    }}
                                    onPress={() => {
                                      setPrompt("");
                                      setType();
                                      setPlaceholder("");
                                      setNewText();
                                      setEditVisible(!editVisible);
                                    }}
                                  >
                                    <Text style={styles.textStyle}>Cerrar</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={{
                                      ...styles.openButton,
                                      backgroundColor: "#2196F3",
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
                                    <Text style={styles.textStyle}>
                                      Guardar
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                      </Modal>
                      {itemExist && (
                        <View>
                          <Text style={styles.modalTitle}>
                            Producto escaneado:
                          </Text>
                          <Text style={styles.modalHead}>{title}</Text>

                          <View style={styles.modalItemBorderCategoria}>
                            <Text style={styles.modalTextTitle}>Tamaño: </Text>
                            <Text style={styles.modalText}>{size}</Text>
                          </View>
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
                              <Text style={styles.modalTextTitle}>
                                Precio:{" "}
                              </Text>
                              <Text style={styles.modalText}>${price}bs</Text>
                            </View>
                          </View>

                          <View style={styles.modalItemBorderCategoria}>
                            <Text style={styles.modalTextTitle}>
                              Categoria:{" "}
                            </Text>
                            <Text style={styles.modalText}>{category}</Text>
                          </View>
                        </View>
                      )}
                      {loadedMode && (
                        <KeyboardAvoidingView
                          behavior={
                            Platform.OS === "android" ? "padding" : "position"
                          }
                          keyboardVerticalOffset={80}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setPrompt("Titulo");
                              setType("Title");
                              setPlaceholder(title);
                              setEditVisible(true);
                            }}
                          >
                            <Text style={styles.modalTitle}>
                              Producto para editar:
                            </Text>
                            <Text style={styles.modalHead}>{title}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.modalItemBorderCategoria}
                            onPress={() => {
                              setPrompt("Tamaño");
                              setType("Size");
                              setPlaceholder(size);
                              setEditVisible(true);
                            }}
                          >
                            <Text style={styles.modalTextTitle}>Tamaño: </Text>
                            <Text style={styles.modalText}>{size}</Text>
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
                                setPlaceholder(brand);
                                setEditVisible(true);
                              }}
                            >
                              <Text style={styles.modalTextTitle}>Marca: </Text>
                              <Text style={styles.modalText}>{brand}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.modalItemBorder}
                              onPress={() => {
                                setPrompt("Precio");
                                setType("Price");
                                setPlaceholder(price.toString());
                                setEditVisible(true);
                              }}
                            >
                              <Text style={styles.modalTextTitle}>
                                Precio:{" "}
                              </Text>
                              <Text style={styles.modalText}>${price}bs</Text>
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
                            <Text style={styles.modalTextTitle}>
                              Categoria:{" "}
                            </Text>
                            <Text style={styles.modalText}>{category}</Text>
                          </TouchableOpacity>
                          <View style={styles.modalItemBorderCategoria}>
                            <TouchableOpacity
                              onPress={() => {
                                setExtendedDate(true);
                              }}
                            >
                              <Text style={styles.modalTextTitle}>
                                Fecha de Exp:
                              </Text>
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
                                      <Text style={styles.textStyle}>
                                        Volver
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={{
                                        ...styles.openButton,
                                      }}
                                      onPress={() => {
                                        setCategory(picked);
                                        setPicker(false);
                                      }}
                                    >
                                      <Text style={styles.textStyle}>
                                        Guardar
                                      </Text>
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
                        </KeyboardAvoidingView>
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
                                      <Text style={styles.textStyle}>
                                        Volver
                                      </Text>
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
                                      <Text style={styles.textStyle}>
                                        Guardar
                                      </Text>
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

                      {itemExist && (
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ color: "silver", fontSize: 13 }}>
                            Puedes editar los detalles del producto (ej. precio)
                            despues de agregarlo a tu inventario.
                          </Text>
                        </View>
                      )}

                      {loadedMode && (
                        <KeyboardAvoidingView
                          keyboardVerticalOffset={80}
                          behavior={
                            Platform.OS === "android" ? "padding" : "position"
                          }
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
                                setQuantity(num);
                              }
                            }}
                          />
                        </KeyboardAvoidingView>
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
                          <Text style={styles.textStyle}>Cerrar</Text>
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
                              console.log(
                                "NEW PRODUCT ADDED now for inventory"
                              );
                              newInvProd();
                              // setModalVisible(!modalVisible);
                              // continueScan();
                            }
                            // if (title) {
                            //   console.log(
                            //     "not adding a new product just to the inventory"
                            //   );
                            //   quantityUpdateHandler();
                            //   setModalVisible(!modalVisible);
                            //   continueScan();
                            // }
                            if (itemExist) {
                              console.log(
                                "going to open the already existing item to inventory"
                              );
                              setLoadedMode(true);
                              setItemExist(false);
                              // continueScan();
                            }
                          }}
                        >
                          {itemExist ? (
                            <Text style={styles.textStyle}>
                              Agregar y Editar
                            </Text>
                          ) : (
                            <Text style={styles.textStyle}>Guardar</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </Modal>
          </View>
        </View>

        <View
          style={{
            height: "90%",
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
  }
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
    backgroundColor: "#F5F3F3",
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
      height: 1,
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
  modalHeadSell: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF4949",
  },
  modalTitleSell: {
    marginBottom: 2,
    textAlign: "center",
    fontSize: 30,
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
  textInputStyleEditNew: {
    height: 40,
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 10,
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
