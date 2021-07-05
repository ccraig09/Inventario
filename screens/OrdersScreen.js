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

// import HeaderButton from "../components/UI/HeaderButton";
import OrderItem from "../components/OrderItem";
import * as ProdActions from "../store/productActions";
import Colors from "../constants/Colors";

const OrdersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allSet, setAllSet] = useState(false);

  const orders = useSelector((state) => state.orders.orders);
  let sortedOrders = orders.sort((a, b) => (a.date < b.date ? 1 : -1));

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(ProdActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  const loadDetails = async () => {
    console.log("reloading");
    setIsRefreshing(true);
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
        <RefreshControl
          colors={Colors.primary}
          refreshing={isRefreshing}
          onRefresh={loadDetails}
        />
      }
      data={sortedOrders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          checkable
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
