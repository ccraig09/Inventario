import { ADD_TO_CART, REMOVE_FROM_CART } from "./cartAction";
import { ADD_ORDER } from "../store/productActions";

import CartItem from "../models/cart-item";
// import { ADD_ORDER } from "../actions/orders";
// import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.productPrice;
      const prodTitle = addedProduct.productTitle;
      const prodCode = addedProduct.productcode;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.productId]) {
        //already have the item in the cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.productId].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.productId].sum + prodPrice,
          prodCode
        );
      } else {
        updatedOrNewCartItem = new CartItem(
          1,
          prodPrice,
          prodTitle,
          prodPrice,
          prodCode
        );
      }
      return {
        ...state,
        items: {
          ...state.items,
          [addedProduct.productId]: updatedOrNewCartItem,
        },
        totalAmount: state.totalAmount + prodPrice,
      };
    case ADD_ORDER:
      return initialState;
    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid];
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        //need to reduce it, not erase it
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice,
          selectedCartItem.productcode
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };
    // case ADD_ORDER:
    //   return initialState;
    // case DELETE_PRODUCT:
    //   if (!state.items[action.pid]) return state;
    //   const updatedItems = { ...state.items };
    //   const itemTotal = state.items[action.pid].sum;
    //   delete updatedItems[action.pid];
    //   return {
    //     ...state,
    //     items: updatedItems,
    //     totalAmount: state.totalAmount - itemTotal,
    //   };
  }
  return state;
};
