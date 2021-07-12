export const ADD_TO_CART = "ADD_TO_CART";
export const EDIT_CART = "EDIT_CART";
// export const ADD_TO_CART_NU = "ADD_TO_CART_NU";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const COMPLETE_REMOVE_FROM_CART = "COMPLETE_REMOVE_FROM_CART";

export const addToCart = (product) => {
  console.log("cart action ORIGINAL", product);

  return { type: ADD_TO_CART, product: product };
};
export const editCart = (product, newPrice) => {
  // console.log("cart action", product.productId, newPrice);
  return { type: EDIT_CART, product: product, newPrice: newPrice };
};

export const removeFromCart = (productId) => {
  return { type: REMOVE_FROM_CART, pid: productId };
};
export const completeRemoveFromCart = (productId) => {
  return { type: COMPLETE_REMOVE_FROM_CART, pid: productId };
};
