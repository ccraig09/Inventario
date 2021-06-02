import moment from "moment";

class Order {
  constructor(id, items, totalAmount, date, checked, doc) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
    this.checked = checked;
    this.doc = doc;

    // this.time = time;
  }

  get readableDate() {
    // return this.date.toLocaleDateString("en-EN", {
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });
    return moment(this.date).format("DD/MM/YYYY, hh:mm a");
  }
  // get readableTime() {
  //   return moment(this.time).startOf("day").fromNow();
  // }
}

export default Order;
