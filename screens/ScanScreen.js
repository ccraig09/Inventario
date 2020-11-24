import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import * as sendProduct from "../store/productActions";

// import HeaderButton from "./components/HeaderButton";

import { BarCodeScanner } from "expo-barcode-scanner";

const ScanScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanner, setScanner] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [size, setSize] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    setScanner(false);
  }, []);

  const scannerStart = () => {
    setScanner(true);
    setScanned(false);
  };

  const uploadProduct = (title, price, size, quantity) => {
    // console.log("uploading product details", title, price, size, quantity);
    try {
      dispatch(sendProduct.createProduct(title, price, size, quantity));
    } catch (err) {
      setError(err.message);
      console.log(error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    let result;
    if (data) {
      result = data;
    }

    if (data === "7771214003646") {
      setTitle("Salsa Golf");
      setSize("380ml");
      setPrice(16);
      setQuantity(6);
      result = `${title} \n Tamaño: ${size} \n Precio: ${price}bs \n Cantidad Total: ${quantity}`;
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

    uploadProduct(title, size, price, quantity);

    Alert.alert(
      "Producto escaneado:",
      `${result}`,
      [
        {
          text: "Volver",
          onPress: () => {
            props.navigation.navigate("Home");
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
        <Button title={"Abrir Scanner"} onPress={() => scannerStart()} />
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
            flex: 0.6,
            // marginTop: 40,
            // flexDirection: "column",
            // justifyContent: "flex-end",
          }}
        >
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        {/* {scanned && ( */}

        {/* )} */}
        <View style={{ marginBottom: 20, marginLeft: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Cosas escaneado: {scanCount}
          </Text>
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
