import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import productsReducer from "./store/productReducer";
import createdProducts from "./store/createdProductReducer";
import storeName from "./store/StoreNameReducer";
import authReducer from "./store/authReducer";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import InventoryNavigator from "./navigation/InventoryNavigator";
import Providers from "./navigation";
import orderReducer from "./store/orders";
import cartReducer from "./store/cartReducer";
import exportOrders from "./store/exportOrdersReducer";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

const rootReducer = combineReducers({
  products: productsReducer,
  availableProducts: createdProducts,
  auth: authReducer,
  storeName: storeName,
  cart: cartReducer,
  orders: orderReducer,
  export: exportOrders,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = async () => {
  await Font.loadAsync({
    "Kufam-SemiBoldItalic": require("./assets/fonts/Kufam-SemiBoldItalic.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    "Lato-BoldItalic": require("./assets/fonts/Lato-BoldItalic.ttf"),
    "Lato-Italic": require("./assets/fonts/Lato-Italic.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onError={console.warn}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <Providers />
    </Provider>
  );
}

// import React, { useState, useEffect } from "react";
// import { createStore, combineReducers, applyMiddleware } from "redux";
// import { Provider } from "react-redux";
// import ReduxThunk from "redux-thunk";
// import productsReducer from "./store/productReducer";
// import createdProducts from "./store/createdProductReducer";
// import cartReducer from "./store/cartReducer";
// import storeName from "./store/StoreNameReducer";
// import authReducer from "./store/authReducer";
// import orderReducer from "./store/orders";
// import firebase from "./components/firebase";

// import { useDispatch } from "react-redux";
// import * as ProdActions from "./store/productActions";
// import AppLoading from "expo-app-loading";

// import InventoryNavigator from "./navigation/InventoryNavigator";
// export const AUTHENTICATE = "AUTHENTICATE";

// const rootReducer = combineReducers({
//   products: productsReducer,
//   availableProducts: createdProducts,
//   auth: authReducer,
//   storeName: storeName,
//   cart: cartReducer,
//   orders: orderReducer,
// });
// const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
// const AppWrapper = () => {
//   return (
//     <Provider store={store}>
//       <App />
//     </Provider>
//   );
// };

// const App = () => {
//   const [fireBLoaded, setFireBLoaded] = useState(false);
//   const dispatch = useDispatch();

//   const authenticate = (userId, token) => {
//     return (dispatch) => {
//       dispatch({ type: AUTHENTICATE, userId: userId });
//     };
//   };
// const fetchFirebase = async () => {
//   return (
//     firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         var userId = user.uid.toString();
//         console.log("THIS IS FROM APP.JS USER ID", userId);
//         dispatch(authenticate(userId));
//       }
//     }),
//     console.log("PREEEELOOOOADADDDIINNNGG"),
//     await dispatch(ProdActions.fetchProducts()),
//     await dispatch(ProdActions.fetchAvailableProducts()),
//     await dispatch(ProdActions.fetchStoreName())
//   );
// };

//   if (!fireBLoaded) {
//     return (
//       <AppLoading
//         startAsync={fetchFirebase}
//         onFinish={() => setFireBLoaded(true)}
//         onError={console.warn}
//       />
//     );
//   } else {
//     return (
//       <Provider store={store}>
//         <InventoryNavigator />
//       </Provider>
//     );
//   }
// };

// export default AppWrapper;
