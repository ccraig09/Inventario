import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Platform,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
// import { HeaderButtons, Item } from "react-navigation-header-buttons";
import firebase from "../components/firebase";

// import HeaderButton from "../components/UI/HeaderButton";
import OrderItem from "../components/OrderItem";
import * as ProdActions from "../store/productActions";
import Colors from "../constants/Colors";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allSet, setAllSet] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);

  const orders = useSelector((state) => state.orders.orders);
  let sortedOrders = orders.sort((a, b) => (a.date < b.date ? 1 : -1));

  const dispatch = useDispatch();
  const fetchAvailableProducts = async () => {
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
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAvailableProducts();
    dispatch(ProdActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  const loadDetails = async () => {
    console.log("reloading");
    setIsRefreshing(true);
    fetchAvailableProducts();

    await dispatch(ProdActions.fetchOrders());
    // if (sortedOrders.find((boo) => boo.isChecked === true)) {
    // if (sortedOrders[0].items.find((boo) => boo.isChecked === true)) {
    //   setAllSet(true);
    // }
    // }
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No tienes pedidos aun.</Text>
      </View>
    );
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={loadDetails} />
      }
      data={sortedOrders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          checkable
          available={availableProducts}
          allSet={allSet}
          id={itemData.item.doc}
          // time={itemData.item.readableTime}
          items={itemData.item.items}
          checked={itemData.item.checked}
          reload={() => {
            loadDetails();
          }}
          // onCheck={() => {
          //   console.log(itemData.item.items[0].productcode);
          //   Alert.alert("itemData.item.items");
          // }}
        />
      )}
    />
  );
};

// OrdersScreen.navigationOptions = (navData) => {
//   return {
//     title: "Sus Pedidos",
//     headerLeft: () => (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//           title="Menu"
//           iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
//           onPress={() => {
//             navData.navigation.toggleDrawer();
//           }}
//         />
//       </HeaderButtons>
//     ),
//   };
// };

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;
