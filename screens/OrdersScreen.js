import React, { useEffect, useState, useContext } from "react";
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
import { AuthContext } from "../navigation/AuthProvider";

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
  const [userProducts, setUserProducts] = useState([]);

  const { user } = useContext(AuthContext);

  const orders = useSelector((state) => state.orders.orders);
  let sortedOrders = orders.sort((a, b) => (a.date < b.date ? 1 : -1));

  const dispatch = useDispatch();
  const fetchProducts = async () => {
    // setError(null);
    // console.log("refreshing");
    try {
      const list = [];
      await firebase
        .firestore()
        .collection("Members")
        .doc(user.uid)
        .collection("Member Products")
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
              isChecked,
            } = doc.data();
            list.push({
              productId: doc.id,
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
              isChecked: isChecked,
            });
          });
        });
      setUserProducts(list);
    } catch (e) {
      console.log(e);
    }
  };
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
    fetchProducts();
    dispatch(ProdActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  const loadDetails = async () => {
    console.log("reloading");
    setIsRefreshing(true);
    fetchAvailableProducts();
    fetchProducts();
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
          userProducts={userProducts}
          allSet={allSet}
          id={itemData.item.doc}
          pId={itemData.item.productcode}
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

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersScreen;
