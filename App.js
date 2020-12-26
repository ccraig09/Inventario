import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import productsReducer from "./store/productReducer";
import authReducer from "./store/authReducer";

import InventoryNavigator from "./navigation/InventoryNavigator";

const rootReducer = combineReducers({
  products: productsReducer,
  // availableProducts: productsReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <InventoryNavigator />
    </Provider>
  );
}
