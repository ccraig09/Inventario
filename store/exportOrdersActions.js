export const ADD_TO_EXPORT_ORDERS = "ADD_TO_EXPORT_ORDERS";

export const addToExportOrders = (exportedOrders) => {
  //   console.log("these are exported orders in route to reducer", exportedOrders);

  return { type: ADD_TO_EXPORT_ORDERS, exportedOrders: exportedOrders };
};
