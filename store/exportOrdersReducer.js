import {
  ADD_TO_CART,
  EDIT_CART,
  REMOVE_FROM_CART,
  COMPLETE_REMOVE_FROM_CART,
} from "./cartAction";
import { ADD_ORDER, REMOVE_ORDER } from "../store/productActions";

import CartItem from "../models/cart-item";
import { ADD_TO_EXPORT_ORDERS } from "../store/exportOrdersActions";
// import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
  items: {},
  // totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_EXPORT_ORDERS:
      const exportProd = action.exportedOrders;
      const id = exportProd.map((item) => ({
        id: item.id,
        date: item.date,
        code: item.items.map((cod) => cod.productcode),
        price: item.items.map((price) => price.productPrice),
        title: item.items.map((title) => title.productTitle),
      }));

      let updatedOrNewCartItem;

      if (state.items[id[0].code]) {
        //already have the item in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[id[0].code],
          id[0].price,
          id[0].title,
          state.items[id[0].code] + id[0].price,
          prodChecked,
          id[0].code
        );
      }

      return {
        ...state,
        items: { [id[0].code]: updatedOrNewCartItem },
      };
  }
  return state;
};
