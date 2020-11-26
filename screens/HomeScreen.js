import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import HeaderButton from "../components/HeaderButton";
import styled, { useTheme } from "styled-components";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/authAction";
import * as ProdActions from "../store/productActions";

import { BarCodeScanner } from "expo-barcode-scanner";
import ProductItem from "../components/ProductItem";

const HomeScreen = (props) => {
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanner, setScanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    setScanner(false);
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Container>
      <View>
        {/* <Text>Hello</Text> */}
        <FlatList
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={isRefreshing}
              onRefresh={loadDetails}
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

        <Button
          title="Cerrar sesión"
          onPress={() => {
            Alert.alert("Cerrar sesión?", "", [
              {
                text: "No",
                style: "default",
              },
              {
                text: "Si",
                style: "destructive",
                onPress: () => {
                  dispatch(authActions.logout());
                  props.navigation.navigate("Auth");
                },
              },
            ]);
          }}
        />
        <Button
          title={"refresh"}
          onPress={() => {
            loadDetails();
          }}
        />
      </View>
    </Container>
  );
};

HomeScreen.navigationOptions = (navData) => {
  return {
    headerLeftShown: false,
    headerBackTitleVisible: false,
    headerTitle: "Inventario: 4C",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Producto"
          iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
          onPress={() => {
            navData.navigation.navigate("Scan");
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

const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
