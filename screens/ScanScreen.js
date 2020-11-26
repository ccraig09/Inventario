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
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();
  const updatedQuantity = useSelector((state) => state.products.products);

  const userProducts = useSelector((state) => {
    const transformedProducts = [];
    for (const key in state.products.products) {
      transformedProducts.push({
        productId: key,
        productTitle: state.products.products[key].title,
        productPrice: state.products.products[key].price,
        productOwner: state.products.products[key].ownerId,
        productQuantity: state.products.products[key].quantity,
        productSize: state.products.products[key].size,
        productTime: state.products.products[key].time,
        productcode: state.products.products[key].code,
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
    // setScanned(false);
  };

  const uploadProduct = (title, price, size, quantity, code) => {
    // const uQuantity = updatedQuantity.filter((quan) => quan.docTitle === code);
    // const UpdQuantity = uQuantity[0].quantity;
    // console.log("testing uQuantity result", UpdQuantity);
    try {
      if (quantity > 1) {
        // setQuantity(UpdQuantity);
        dispatch(sendProduct.updateQuantity(quantity + 1, code));
      } else {
        dispatch(sendProduct.createProduct(title, price, size, quantity, code));
      }
    } catch (err) {
      setError(err.message);
      console.log(error);
    }
    // console.log("data listed", title, price, size, quantity, code);
  };

  const handleBarCodeScanned2 = ({ type, data }) => {
    setScanned(true);
    let result;
    // if (data) {
    //   result = data;
    // }

    if (data === "7771214003646") {
      setTitle("Salsa Golf");
      setPrice(16);
      setQuantity(quantity + 1);
      setSize("380ml");
      setCode(data.toString());

      result = `${title} \n Tamaño: ${size} \n Precio: ${price}bs \n Cantidad Total: ${quantity} \n Codigo: ${code}`;
    }
    Alert.alert(
      "Producto escaneado:",
      `${result}`,
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
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log("this is the tupe", type);
    dispatch(ProdActions.fetchProducts());
    let result;
    if (data) {
      result = data;
    }

    if (data === "7771214003646") {
      setTitle("Salsa Golf");
      setPrice(16);
      setQuantity(quantity + 1);
      setSize("380ml");
      setCode(data.toString());

      result = `${title} \n Tamaño: ${size} \n Precio: ${price}bs \n Cantidad Total: ${quantity} \n Codigo: ${code}`;
    }
    // if (data === "7771214003646" && quantity > 1) {
    //   console.log("dup");
    //   setTitle("Salsa Golf");
    //   setPrice(16);
    //   setQuantity(quantity + 1);
    //   setSize("380ml");
    //   setCode(data.toString());

    //   result = `${title} \n Tamaño: ${size} \n Precio: ${price}bs \n Cantidad Total: ${quantity} \n Codigo: ${code}`;
    // }
    if (data === "7590011251100") {
      setTitle("Galletas de Oreo");
      setPrice(4);
      setQuantity(quantity + 1);
      setSize("1");
      setCode(data.toString());

      result = `${title} \n Tamaño: ${size} \n Precio: ${price}bs \n Cantidad Total: ${quantity} \n Codigo: ${code}`;
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

    uploadProduct(title, price, quantity, size, code);

    Alert.alert(
      "Producto escaneado:",
      `${result}`,
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
            // marginTop: 40,
            // flexDirection: "column",
            // justifyContent: "flex-end",
          }}
        >
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned2}
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
