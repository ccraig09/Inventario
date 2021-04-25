import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import productsReducer from "./store/productReducer";
import createdProducts from "./store/createdProductReducer";
import storeName from "./store/StoreNameReducer";
import authReducer from "./store/authReducer";
import { useSelector, useDispatch } from "react-redux";
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

// const dispatch = useDispatch();

// const fetchFirebase = () => {
//   // console.log("synce started");
//   dispatch(ProdActions.fetchAvailableProducts());
// dispatch(ProdActions.fetchStoreName())
//   dispatch(ProdActions.fetchProducts());
// };
export default function App() {
  // const [fireBLoaded, setFireBLoaded] = useState(false);
  // if (!fireBLoaded) {
  //   return (
  //     <AppLoading
  //       startAsync={fetchFirebase}
  //       onFinish={() => setFireBLoaded(true)}
  //       onError={console.warn}
  //     />
  //   );
  // }

  return (
    <Provider store={store}>
      <InventoryNavigator />
    </Provider>
  );
}

// const fetchFirebase = () => {
//   // const images = [require('./assets/snack-icon.png')];

//   const cacheImages = dispatch(ProdActions.fetchStoreName());
//   return Promise.all(cacheImages);
// };
