import React, { useState, useEffect } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import productsReducer from "./store/productReducer";
import createdProducts from "./store/createdProductReducer";
import cartReducer from "./store/cartReducer";
import storeName from "./store/StoreNameReducer";
import authReducer from "./store/authReducer";
import firebase from "./components/firebase";

import { useDispatch } from "react-redux";
import * as ProdActions from "./store/productActions";
import AppLoading from "expo-app-loading";

import InventoryNavigator from "./navigation/InventoryNavigator";
export const AUTHENTICATE = "AUTHENTICATE";

const rootReducer = combineReducers({
  products: productsReducer,
  availableProducts: createdProducts,
  auth: authReducer,
  storeName: storeName,
  cart: cartReducer,
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
  const [fireBLoaded, setFireBLoaded] = useState(false);
  const dispatch = useDispatch();

  const authenticate = (userId, token) => {
    return (dispatch) => {
      dispatch({ type: AUTHENTICATE, userId: userId });
    };
  };
  const fetchFirebase = async () => {
    return (
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var userId = user.uid.toString();
          console.log("THIS IS FROM APP.JS USER ID", userId);
          dispatch(authenticate(userId));
        }
      }),
      console.log("PREEEELOOOOADADDDIINNNGG"),
      await dispatch(ProdActions.fetchProducts()),
      await dispatch(ProdActions.fetchAvailableProducts()),
      await dispatch(ProdActions.fetchStoreName())
    );
  };

  if (!fireBLoaded) {
    return (
      <AppLoading
        startAsync={fetchFirebase}
        onFinish={() => setFireBLoaded(true)}
        onError={console.warn}
      />
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
