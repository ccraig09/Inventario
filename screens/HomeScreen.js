import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
  SectionList,
} from "react-native";

import HeaderButton from "../components/HeaderButton";
import HeaderButton2 from "../components/HeaderButton2";
import styled, { useTheme } from "styled-components";
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../store/authAction";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import IconMat from "react-native-vector-icons/MaterialCommunityIcons";
import * as ProdActions from "../store/productActions";
import firebase from "../components/firebase";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SwipeListView } from "react-native-swipe-list-view";

import { BarCodeScanner } from "expo-barcode-scanner";
import ProductItem from "../components/ProductItem";
import { AuthContext } from "../navigation/AuthProvider";

const HomeScreen = ({ navigation }) => {
  const { user, deleteProduct } = useContext(AuthContext);
  const db = firebase.firestore().collection("Members");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [focused, setFocused] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [userId, setUserId] = useState();

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

  // const userProducts = useSelector((state) => {
  //   const transformedProducts = [];
  //   for (const key in state.products.products) {
  //     transformedProducts.push({
  //       productId: key,
  //       productTitle: state.products.products[key].Title,
  //       productPrice: state.products.products[key].Price,
  //       productCategory: state.products.products[key].Category,
  //       productOwner: state.products.products[key].ownerId,
  //       productQuantity: state.products.products[key].Quantity,
  //       productSize: state.products.products[key].Size,
  //       productBrand: state.products.products[key].Brand,
  //       productcode: state.products.products[key].Code,
  //       productExp: state.products.products[key].ExpDate,
  //       docTitle: state.products.products[key].docTitle,
  //     });
  //   }
  //   return transformedProducts.sort((a, b) =>
  //     a.productTitle > b.productTitle ? 1 : -1
  //   );
  // });

  // const createdStoreName = useSelector((state) => state.storeName.storeName);

  // const dispatch = useDispatch();

  const loadDetails = async () => {
    // setError(null);
    console.log("refreshing");
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
      setInventory(list);
    } catch (e) {
      console.log(e);
    }
    try {
      await firebase
        .firestore()
        .collection("Members")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data().StoreName);
            setStoreName(doc.data().StoreName);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        });
    } catch (e) {
      console.log(e);
    }

    setIsRefreshing(false);
  };

  // props.navigation.setParams({ storeTitle: createdStoreName });

  // useEffect(() => {
  //   const willFocusSub = props.navigation.addListener("willFocus", loadDetails);
  //   return () => {
  //     willFocusSub.remove();
  //   };
  // }, [loadDetails]);

  useEffect(() => {
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
        setInventory(list);
      } catch (e) {
        console.log(e);
      }
    };
    const fetchStoreName = async () => {
      try {
        await firebase
          .firestore()
          .collection("Members")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // console.log("Document data:", doc.data().StoreName);
              setStoreName(doc.data().StoreName);
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
        if (isLoading) {
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchPost();
    fetchStoreName();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      console.log("loading homePage");
      setScanner(false);
      setIsLoading(false);
    })();
  }, []);

  const renderItem = (itemData, rowMap) => {
    return (
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
    );
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async (rowMap, rowKey, Title) => {
    console.log("this is previndex", rowKey);
    const newData = [...inventory];
    const prevIndex = inventory.findIndex((item) => item.key === rowKey);

    // loadDetails()

    // loadDetails()
    Alert.alert(
      "Borrar producto?",
      `El producto "${Title}" será borrado de tu inventario?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Si",
          onPress: async () => (
            console.log("deletiiiing"),
            deleteProduct(rowKey),
            console.log("DELETED"),
            closeRow(rowMap, rowKey),
            newData.splice(prevIndex, 1),
            // setInventory(newData),
            loadDetails()
          ),
        },
      ]
    );
  };
  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const HiddenItemWithActions = (props) => {
    const { swipeAnimatedValue, onClose, onDelete } = props;

    return (
      <View style={styles.rowBack}>
        {/* <Text>Left</Text> */}
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={onClose}
        >
          <IconMat
            name="close-circle-outline"
            size={25}
            style={styles.trash}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={onDelete}
        >
          <Animated.View
            style={[
              styles.trash,
              {
                transform: [
                  {
                    scale: swipeAnimatedValue.interpolate({
                      inputRange: [-90, -45],
                      outputRange: [1, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            <IconMat name="trash-can-outline" size={25} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHiddenItem = (itemData, rowMap) => {
    return (
      <HiddenItemWithActions
        data={inventory}
        rowMap={rowMap}
        onClose={() => closeRow(rowMap, itemData.item.key)}
        onDelete={() =>
          deleteRow(rowMap, itemData.item.key, itemData.item.productTitle)
        }
      />
    );
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

  if (isLoading) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <SkeletonPlaceholder>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 120, height: 20, borderRadius: 4 }} />
              <View
                style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
            <View
              style={{ marginTop: 6, width: 350, height: 200, borderRadius: 4 }}
            />
          </View>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 120, height: 20, borderRadius: 4 }} />
              <View
                style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
            <View
              style={{ marginTop: 6, width: 350, height: 200, borderRadius: 4 }}
            />
          </View>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 120, height: 20, borderRadius: 4 }} />
              <View
                style={{ marginTop: 6, width: 80, height: 20, borderRadius: 4 }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
            <View
              style={{ marginTop: 6, width: 350, height: 200, borderRadius: 4 }}
            />
          </View>
        </SkeletonPlaceholder>
      </ScrollView>
      // <View style={styles.centered}>
      //   <View>
      //     <ActivityIndicator size="large" color="#FF4949" />
      //     <Text>Cargando su inventario </Text>
      //   </View>
      // </View>
    );
  }

  // if (isLoading) {

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <View style={styles.topHeader}>
          <View style={styles.searchText}>
            <View style={{ left: 10, position: "absolute" }}>
              <Icon.Button
                name="ios-menu"
                size={25}
                backgroundColor="#FF4949"
                color="white"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            </View>
            <Text style={styles.storeText}>{storeName} </Text>
            <View style={{ right: 10, position: "absolute" }}>
              <TouchableOpacity
                onPress={() => {
                  loadDetails();
                }}
              >
                <MaterialIcons name="refresh" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              marginTop: 15,
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
          </View>

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
                setFilteredDataSource(inventory);
                setMasterDataSource(inventory);
              }}
              onBlur={() => {
                setFocused(false);
                // setFilteredDataSource(inventory);
                // setMasterDataSource(inventory);
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
        </View>
      </View>

      {!isLoading && inventory.length === 0 ? (
        <View style={styles.centered}>
          <Text>No Productos registrado. Agregar products abajo 👇🏽 </Text>
          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("Scan");
            }}
          >
            <View>
              <Text style={{ color: "blue" }}>Aqui</Text>
            </View>
          </TouchableOpacity> */}
        </View>
      ) : (
        <SwipeListView
          refreshControl={
            <RefreshControl
              colors={["#FF4949", "#FF4949"]}
              refreshing={isRefreshing}
              onRefresh={loadDetails}
            />
          }
          useFlatList={true}
          data={inventory}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-150}
          disableRightSwipe
          onRowOpen={(rowKey, rowMap) => {
            setTimeout(() => {
              rowMap[rowKey] && rowMap[rowKey].closeRow();
            }, 2000);
          }}
          // previewRowKey={inventory[0].key}

          onRowDidOpen={onRowDidOpen}
        />
      )}

      {/* <FlatList
        refreshControl={
          <RefreshControl
            colors={["#FF4949", "#FF4949"]}
            refreshing={isRefreshing}
            onRefresh={loadDetails}
          />
        }
        data={focused ? filteredDataSource : inventory}
        keyExtractor={(item) => item.id}
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
      /> */}
      <ActionButton buttonColor="#FF4949">
        <ActionButton.Item
          buttonColor="#FF4949"
          title="Escáner"
          onPress={() => navigation.navigate("Scanner")}
        >
          <Icon name="qr-code" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#FF4949"
          title="Catálogo"
          onPress={() => {
            navigation.navigate("Catálogo");
          }}
        >
          <Icon name="book" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        {/* <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
          <Icon name="md-done-all" style={styles.actionButtonIcon} />
        </ActionButton.Item> */}
      </ActionButton>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  topContainer: {
    height: 200,
  },
  topHeader: {
    height: "90%",
    backgroundColor: "#FF4949",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    // overflow: "hidden",
    // marginBottom: 12,
    shadowColor: "#FF4949",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 9.84,
    elevation: 0,
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
  menuSearch: {
    color: "white",
    fontWeight: "bold",
    // textShadowColor: "rgba(0, 0, 0, 0.75)",
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 5,
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  image: {
    height: "100%",
    width: "100%",
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
    // textShadowColor: "rgba(0, 0, 0, 0.75)",
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 10,
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
  rowFront: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 15,
  },
  backRightBtn: {
    alignItems: "flex-end",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: "#1f65ff",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#666",
  },
  details: {
    fontSize: 12,
    color: "#999",
  },
});

const Container = styled.View`
  flex: 1;
  background-color: #ededed;
  /* border-bottom-left-radius: 20px;
  border-top-right-radius: 10px; */
`;
