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
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
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
  const [scanner, setScanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [title, setTitle] = useState([]);
  // const [sell, setSell] = useState(false);

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
        productcode: state.products.products[key].Code,
        docTitle: state.products.products[key].docTitle,
      });
    }
    return transformedProducts;
  });

  const loadDetails = async () => {
    setIsRefreshing(true);
    await dispatch(ProdActions.fetchProducts());
    try {
    } catch (err) {
      setError(err.message);
    }
    console.log("user products loaded?", userProducts);
    setFilteredDataSource(userProducts);
    setMasterDataSource(userProducts);

    console.log("loading homePage");
    setIsRefreshing(false);
  };

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

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.productTitle
          ? item.productTitle.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        // console.log("ITEMDATA IS===", itemData);
        return itemData.indexOf(textData) > -1;
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

  // const modeHandler = () => {
  //   setSell((prevState) => !prevState);
  //   console.log(sell);
  //   props.navigation.setParams({ mode: sell });
  // };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Container>
      <View>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Buscar"
        />
        <FlatList
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={isRefreshing}
              onRefresh={loadDetails}
            />
          }
          data={filteredDataSource}
          keyExtractor={(item) => item.productId}
          renderItem={(itemData) => (
            <ProductItem
              title={itemData.item.productTitle}
              onSelect={() => {
                setModalVisible(true);
                // alert(itemData.item.productTitle);
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            marginTop: 10,
          }}
        >
          <View style={{ width: 170 }}>
            <Button
              color="red"
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
          </View>
          <View style={{ width: 170, borderRadius: 15 }}>
            <Button
              title={"refrescar"}
              onPress={() => {
                loadDetails();
              }}
            />
          </View>
        </View>
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
            navData.navigation.navigate(
              "Scan"
              // {
              // mode: navData.navigation.getParam("mode"),
              // }
            );
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
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "black",
    backgroundColor: "#FFFFFF",
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
});

const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
