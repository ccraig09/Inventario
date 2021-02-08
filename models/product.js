class Product {
  constructor(
    id,
    Title,
    ownerId,
    Price,
    Category,
    Quantity,
    Size,
    time,
    Brand,
    Code,
    ExpDate,
    docTitle
  ) {
    this.id = id;
    this.Title = Title;
    this.ownerId = ownerId;
    this.Price = Price;
    this.Category = Category;
    this.Quantity = Quantity;
    this.Size = Size;
    this.time = time;
    this.Brand = Brand;
    this.Code = Code;
    this.ExpDate = ExpDate;
    this.docTitle = docTitle;
  }
}

export default Product;
