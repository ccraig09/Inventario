import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import HeaderButton from "../components/HeaderButton";

import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { BarCodeScanner } from "expo-barcode-scanner";

const HomeScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanner, setScanner] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    setScanner(false);
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(data);
    let result;

    if (data) {
      result = data;
    }
    if (data === "7771214003646") {
      result =
        "Producto escaneado: \n Salsa Golf \n Tamaño: 380ml \n Precio: 16bs \n Cantidad Total: 6";
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
    alert(`${result}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View>
      <Text>Hello</Text>
      <Button
        title={"Escanear"}
        onPress={() => props.navigation.navigate("Scan")}
      />
    </View>
  );
};

HomeScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Inventario:___",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Producto"
          iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
          onPress={() => {
            navData.navigation.navigate("ScanScreen");
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
