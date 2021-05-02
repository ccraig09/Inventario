import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import productsReducer from "./store/productReducer";
import createdProducts from "./store/createdProductReducer";
import storeName from "./store/StoreNameReducer";
import authReducer from "./store/authReducer";
import { useDispatch } from "react-redux";
import * as ProdActions from "./store/productActions";
import AppLoading from "expo-app-loading";

import InventoryNavigator from "./navigation/InventoryNavigator";

const rootReducer = combineReducers({
  products: productsReducer,
  availableProducts: createdProducts,
  auth: authReducer,
  storeName: storeName,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
const App = () => {
  const dispatch = useDispatch();

  const [fireBLoaded, setFireBLoaded] = useState(false);

  useEffect(() => {
    console.log("PREALOOOOADINF");
    dispatch(ProdActions.fetchAvailableProducts());
    dispatch(ProdActions.fetchStoreName());
    dispatch(ProdActions.fetchProducts()).then(setFireBLoaded(true));
    // fetchFirebase();
  }, [dispatch]);

  const fetchFirebase = async () => {
    console.log("PREALOOOOADINF");
    dispatch(ProdActions.fetchAvailableProducts());
    dispatch(ProdActions.fetchStoreName());
    dispatch(ProdActions.fetchProducts()).then(setFireBLoaded(true));
  };
  // const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  if (!fireBLoaded) {
    return (
      <Provider store={store}>
        <View
          stlye={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text></Text>
        </View>
      </Provider>
    );
  } else {
    return (
      <Provider store={store}>
        <InventoryNavigator />
      </Provider>
    );
  }
};

export default AppWrapper;
