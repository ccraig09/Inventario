import {
  CREATE_PRODUCT,
  SET_PRODUCT,
  UPDATE_PRODUCT,
  ADDED_PRODUCT,
  SET_AVAILABLE_PRODUCT,
} from "../store/productActions";
import Product from "../models/product";
import availableProduct from "../models/availableProduct";

initialState = {
  products: [],
  availableProducts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT:
      return {
        products: action.products,
      };
    // case SET_AVAILABLE_PRODUCT:
    //   return {
    //     availableProducts: action.availableProducts,
    //   };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.Title,
        action.productData.ownerId,
        action.productData.Price,
        action.productData.Category,
        action.productData.Quantity,
        action.productData.Size,
        action.productData.Brand,
        action.productData.time,
        action.productData.Code
      );
      return {
        ...state,
        products: state.products.concat(newProduct),
      };
    // case ADDED_PRODUCT:
    //   const addedProduct = new availableProduct(
    //     action.productData.Product,
    //     action.productData.Size,
    //     action.productData.Price,
    //     action.productData.Category,
    //     action.productData.Brand,
    //     action.productData.code
    //   );
    //   return {
    //     ...state,
    //     availableProducts: state.availableProducts.concat(addedProduct),
    //   };

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
