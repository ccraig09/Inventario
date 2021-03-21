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
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

import { StatusBar } from "expo-status-bar";
// import SearchableFlatlist from "searchable-flatlist";
import HeaderButton from "../components/HeaderButton";
import HeaderButton2 from "../components/HeaderButton2";
import styled, { useTheme } from "styled-components";
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/authAction";
import * as ProdActions from "../store/productActions";

import { BarCodeScanner } from "expo-barcode-scanner";
import ProductItem from "../components/ProductItem";
let screenWidth = Dimensions.get("window").width;

const HomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [focused, setFocused] = useState(false);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanner, setScanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [title, setTitle] = useState([]);
  const [productSelect, setProductSelect] = useState(true);
  const [categorySelect, setCategorySelect] = useState(false);
  const [brandSelect, setBrandSelect] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [storeName, setStoreName] = useState("");
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
        productBrand: state.products.products[key].Brand,
        productcode: state.products.products[key].Code,
        productExp: state.products.products[key].ExpDate,
        docTitle: state.products.products[key].docTitle,
      });
    }
    return transformedProducts;
  });

  const createdStoreName = useSelector((state) => state.storeName.storeName);

  // let storeName;
  const dispatch = useDispatch();

  const loadDetails = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(ProdActions.fetchAvailableProducts());
      await dispatch(ProdActions.fetchProducts());
      await dispatch(ProdActions.fetchStoreName());
    } catch (err) {
      setError(err.message);
    }
    setFilteredDataSource(userProducts);
    setMasterDataSource(userProducts);
    setStoreName(createdStoreName);
    // console.log("LOADED THE STORENAME", createdStoreName);

    props.navigation.setParams({ storeTitle: createdStoreName });
    setIsRefreshing(false);
  };

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadDetails);
    return () => {
      willFocusSub.remove();
    };
  }, [loadDetails]);

  useEffect(() => {
    setIsLoading(true);
    loadDetails();

    console.log("loading homePage");
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    setScanner(false);
    setIsLoading(false);
  }, []);

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

  // const ItemSeprator = () => (
  //   <View
  //     style={{
  //       height: 8,
  //       width: "100%",
  //       backgroundColor: "rgba(0,0,0,0.5)",
  //     }}
  //   />
  // );

  // const modeHandler = () => {
  //   setSell((prevState) => !prevState);
  //   console.log(sell);
  //   props.navigation.setParams({ mode: sell });
  // };
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Productos registrado. Agregar products </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Scan");
          }}
        >
          <View>
            <Text style={{ color: "blue" }}>Aqui</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Container>
      <View>
        <View style={styles.topHeader}>
          {/* <Svg height="20%" width="100%" viewBox="0 0 100 100">
          <Circle
            cx={100 / 2}
            cy={`-${898 - 100 + 2}`}
            r="888.5"
            fill={null}
            stroke="red"
            strokeWidth="2"
          /> */}
          <LinearGradient
            // Background Linear Gradient
            start={{ x: -1, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#0F25C8", "#2777E9"]}
            style={styles.background}
          />

          <View style={styles.searchText}>
            <Text style={styles.storeText}>{createdStoreName} </Text>
            <View style={{ right: 10, position: "absolute" }}>
              <TouchableOpacity
                onPress={() => {
                  loadDetails();
                }}
              >
                <MaterialIcons name="refresh" size={30} color="white" />
              </TouchableOpacity>
            </View>
            {/* <Text style={{ color: "grey" }}>Buscar Por: </Text> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              marginTop: 25,
              paddingHorizontal: 15,
              justifyContent: "space-between",
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
                <AntDesign name="checkcircle" size={24} color="orange" />
              ) : (
                <Entypo name="circle" size={24} color="white" />
              )}
              <Text style={{ color: "white" }}> Producto</Text>
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
                <AntDesign name="checkcircle" size={24} color="orange" />
              ) : (
                <Entypo name="circle" size={24} color="white" />
              )}
              <Text style={{ color: "white" }}> Categoria</Text>
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
                <AntDesign name="checkcircle" size={24} color="orange" />
              ) : (
                <Entypo name="circle" size={24} color="white" />
              )}
              <Text style={{ color: "white" }}> Marca</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setBrandSelect(false);
                setCategorySelect(false);
                setProductSelect(true);
                setSearch("");
                setFilteredDataSource(userProducts);
              }}
            >
              <MaterialIcons name="clear" size={24} color="red" />
              <Text style={{ color: "white" }}> Aclarar</Text>
            </TouchableOpacity>
          </View>

          {/* <TextInput
          style={styles.textInputStyle}
          onFocus={() => {
            setFocused(true);
            // setFilteredDataSource(userProducts);
            // setMasterDataSource(userProducts);
          }}
          clearButtonMode={"always"}
          // onBlur={() => {
          //   setFocused(false);
          // }}
          onChangeText={(searchTerm) => setSearchTerm(searchTerm)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Buscar"
        /> */}
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
            <MaterialIcons name="search" size={24} color="black" />
          </View>
          {/* </Svg> */}
        </View>

        {/* <TextInput
          placeholder={"Search"}
          style={sSearchBar}
          onChangeText={searchTerm => this.setState({ searchTerm })}
        /> */}
        <View style={{ backgroundColor: "#EDEDED" }}>
          <FlatList
            refreshControl={
              <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={isRefreshing}
                onRefresh={loadDetails}
              />
            }
            data={focused ? filteredDataSource : userProducts}
            keyExtractor={(item) => item.productId}
            // ItemSeparatorComponent={ItemSeprator}
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
                brand={itemData.item.productBrand}
                code={itemData.item.productcode}
                exp={itemData.item.productExp}
                reload={() => {
                  loadDetails();
                }}
              />
            )}
          />
        </View>

        {/* <TextInput
          style={styles.textInputStyle}
          onFocus={() => {
            setFocused(true);
            // setFilteredDataSource(userProducts);
            // setMasterDataSource(userProducts);
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
        <FlatList
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={isRefreshing}
              onRefresh={loadDetails}
            />
          }
          data={focused ? filteredDataSource : userProducts}
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
              brand={itemData.item.productBrand}
              code={itemData.item.productcode}
              reload={() => {
                loadDetails();
              }}
            />
          )}
        /> */}

        {/* <View
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
        </View> */}
      </View>
    </Container>
  );
};

HomeScreen.navigationOptions = (navData) => {
  const Tienda = navData.navigation.getParam("storeTitle");
  return {
    headerLeftShown: false,
    headerBackTitleVisible: false,
    headerTitle: "Inventario",
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        {/* <HeaderButtons HeaderButtonComponent={HeaderButton2}>
          <Item
            title="Producto"
            // iconColor={"black"}
            iconName={
              Platform.OS === "android"
                ? "settings-outline"
                : "settings-outline"
            }
            onPress={() => {
              navData.navigation.navigate("Settings", {
                StoreTitle: Tienda,
              });
            }}
          />
        </HeaderButtons> */}
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Producto"
            iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
            onPress={() => {
              navData.navigation.navigate("Scan");
            }}
          />
        </HeaderButtons>
      </View>
    ),
    headerLeft: () => (
      <View style={{ flexDirection: "row" }}>
        <HeaderButtons HeaderButtonComponent={HeaderButton2}>
          <Item
            title="Producto"
            // iconColor={"black"}
            iconName={
              Platform.OS === "android"
                ? "settings-outline"
                : "settings-outline"
            }
            onPress={() => {
              navData.navigation.navigate("Settings", {
                StoreTitle: Tienda,
              });
            }}
          />
        </HeaderButtons>
      </View>
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
  topHeader: {
    height: "20%",
    // backgroundColor: "#F86464",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    overflow: "hidden",
    marginBottom: 5,
  },
  textInputStyle: {
    width: "85%",
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 20,
    margin: 10,
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
  centered: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  menuOption: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  searchText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    marginTop: 10,
  },
  storeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    marginBottom: 10,
    // overflow: "hidden",
    // borderTopEndRadius: 30,
  },
});

const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
