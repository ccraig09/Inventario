import { CREATE_PRODUCT, SET_PRODUCT } from "../store/productActions";
import Product from "../models/product";

initialState = {
  products: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT:
      return {
        products: action.products,
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.title,
        action.productData.ownerId,
        action.productData.price,
        action.productData.quantity,
        action.productData.size,
        action.productData.time
      );
      return {
        ...state,
        products: state.products.concat(newProduct),
      };
  }

  return state;
};
