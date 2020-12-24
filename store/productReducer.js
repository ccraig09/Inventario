import {
  CREATE_PRODUCT,
  SET_PRODUCT,
  UPDATE_PRODUCT,
} from "../store/productActions";
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
        action.productData.Title,
        action.productData.ownerId,
        action.productData.Price,
        action.productData.Category,
        action.productData.Quantity,
        action.productData.Size,
        action.productData.time,
        action.productData.Code
      );
      return {
        ...state,
        products: state.products.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      const productIndex = state.products.findIndex(
        (prod) => prod.Code === action.productData.Code
      );
      const updatedProduct = new Product(
        action.productData.id,
        action.productData.Title,
        action.productData.ownerId,
        action.productData.Price,
        action.productData.Category,
        action.productData.Quantity,
        action.productData.Size,
        action.productData.time,
        action.productData.Code
      );
      const updatedUserProducts = [...state.products];
      updatedUserProducts[productIndex] = updatedProduct;
      return {
        ...state,
        products: updatedUserProducts,
      };
  }

  return state;
};
