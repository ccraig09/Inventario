class CartItem {
  constructor(
    quantity,
    productPrice,
    productTitle,
    sum,
    isChecked,
    productcode
  ) {
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.sum = sum;
    this.isChecked = isChecked;
    this.productcode = productcode;
  }
}

export default CartItem;
