import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  RefreshControl,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import * as sendProduct from "../store/productActions";
import * as ProdActions from "../store/productActions";
import ProductItem from "../components/ProductItem";

// import HeaderButton from "./components/HeaderButton";

import { BarCodeScanner } from "expo-barcode-scanner";

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
  const [quantity, setQuantity] = useState(0);
  const [value, setValue] = useState("");

  const dispatch = useDispatch();
  const updatedQuantity = useSelector((state) => state.products.products);

  const userProducts = useSelector((state) => {
    const transformedProducts = [];
    for (const key in state.products.products) {
      transformedProducts.push({
        productId: key,
        productTitle: state.products.products[key].Title,
        productPrice: state.products.products[key].Price,
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

  const loadDetails = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(ProdActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    // const uQuantity = updatedQuantity.filter((quan) => quan.docTitle === Code);
    // const UpdQuantity = uQuantity.length === 0 ? {} : uQuantity[0].Quantity;

    setIsRefreshing(false);
  });

  useEffect(() => {
    // console.log("quantity list", updatedQuantity[1].quantity);
    loadDetails();

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    // setScanner(false);
  }, []);

  const scannerStart = () => {
    setScanner(true);
    setScanned(false);
  };

  const uploadProduct = (Title, Price, Quantity, Size, Code) => {
    // setQuantity((state) => {
    //   console.log("i hope this is quantity", state); // "React is awesome!"

    //   return state;
    // });
    console.log("data listed", Quantity);
    // console.log("data listed", Title, Price, Quantity, Size, Code);
    try {
      if (Quantity > 1) {
        console.log(
          "item already exist, updating",
          Title,
          Price,
          Quantity,
          Size,
          Code
        );

        // setQuantity(UpdQuantity);
        dispatch(
          sendProduct.updateQuantity(Title, Price, Quantity, Size, Code)
        );
      } else {
        console.log("first upload");
        dispatch(sendProduct.createProduct(Title, Price, Quantity, Size, Code));
      }
    } catch (err) {
      setError(err.message);
      console.log(error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    let Title;
    let Price;
    let Quantity;
    let Size;
    let Code;
    let result;
    if (data) {
      result = data;
    }

    if (data === "7771214003646") {
      Title = "Salsa Golf";
      Price = 16;
      Size = "350";
      Quantity = quantity + 1;
      console.log("this is var Quantity", Quantity);
      Code = data.toString();
      setQuantity(Quantity);

      result = `${Title} \n Tamaño: ${Size} \n Precio: ${Price}bs \n Cantidad Total: ${Quantity} \n Codigo: ${Code}`;
    }

    if (data === "7590011251100") {
      Title = "Galletas de Oreo";
      Price = 4;
      Size = "1";
      Quantity = quantity + 1;
      console.log("this is var Quantity", Quantity);
      Code = data.toString();
      setQuantity(Quantity);

      result = `${Title} \n Tamaño: ${Size} \n Precio: ${Price}bs \n Cantidad Total: ${Quantity} \n Codigo: ${Code}`;
    }
    if (data === "7759185002158") {
      setTitle("Elite Kleenex");
      setPrice(2);
      setQuantity(quantity + 1);
      setSize("1");
      setCode(data.toString());

      result = `${title} \n Tamaño: ${size} \n Precio: ${price}bs \n Cantidad Total: ${quantity} \n Codigo: ${code}`;
    }
    if (data === "7772106001450") {
      result =
        "Producto escaneado: \n 7-up \n Tamaño: 500ml \n Precio: 5bs \n Cantidad Total: 5";
    }
    if (data === "7771609003268") {
      result =
        "Producto escaneado: \n Powerade azul \n Tamaño: 1litro \n Precio: 10bs \n Cantidad Total: 3";
    }
    if (data === "7771609001677") {
      result =
        "Producto escaneado: \n Agua Vital sin gas \n Tamaño: 3litro \n Precio: 10bs \n Cantidad Total: 3";
    }

    // setTitle(Title);
    // setPrice(Price);
    // setQuantity(Quantity);
    // setSize(Size);
    // setCode(Code);

    uploadProduct(Title, Price, Quantity, Size, Code);

    // const uQuantity = updatedQuantity.filter((quan) => quan.docTitle === Code);
    // const UpdQuantity = uQuantity.length === 0 ? {} : uQuantity[0].Quantity;
    // console.log("testing uQuantity result", UpdQuantity);

    Alert.alert(
      "Producto escaneado:",
      result,
      [
        {
          text: "Volver",
          onPress: () => {
            props.navigation.navigate("Home"), setScanned(false);
          },
          style: "cancel",
        },
        { text: "Escanear", onPress: () => setScanned(false) },
      ],
      { cancelable: false }
    );
    loadDetails();
    const UpdQuantity =
      userProducts.length === 0 ? {} : userProducts[0].productQuantity;
    setQuantity(UpdQuantity);
    console.log("testing uQuantity result", UpdQuantity);
    console.log("finally test for quantity result", quantity);
    setScanCount(scanCount + 1);
    console.log(data);
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
        <Button title={"Abrir Scanner"} onPress={() => setScanner(true)} />
      </View>
    );
  }
  if (scanner) {
    return (
      <View
        style={{
          flex: 1,
          // marginTop: 40,
          // flexDirection: "column",
          // justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            height: "60%",
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
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Cosas escaneado: {scanCount}
          </Text>
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
                quantity={itemData.item.productQuantity}
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
});
