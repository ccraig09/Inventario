export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const ADD_ORDER = "ADD_ORDER";
export const REMOVE_ORDER = "REMOVE_ORDER";
export const SET_ORDERS = "SET_ORDERS";
export const ADDED_PRODUCT = "ADDED_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";
export const SET_AVAILABLE_PRODUCT = "SET_AVAILABLE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_STORE_NAME = "SET_STORE_NAME";
import Product from "../models/product";
import availableProduct from "../models/availableProduct";
import Order from "../models/order";

import firebase from "../components/firebase";

export const db = firebase.firestore().collection("Members");
export const dbP = firebase.firestore().collection("Products");
export const dP = firebase.firestore().collection("Members");
export const dPD = firebase.firestore().collection("Data");

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userId = user.uid.toString();
        console.log("THIS IS FROM productactions USER ID", userId);

        // const userId = getState().auth.userId;
        // console.log("fetchProduct Actions initiated", userId);
        // const userId = firebase.auth().currentUser.uid;
        // const token = getState().auth.token;
        try {
          const events = db.doc(userId).collection("Member Products");
          events.get().then((querySnapshot) => {
            const collection = querySnapshot.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            });
            // console.log("this is collection FROM THE FETCH", collection);

            const loadedProducts = [];

            for (const key in collection) {
              loadedProducts.push(
                new Product(
                  key,
                  collection[key].Title,
                  collection[key].ownerId,
                  collection[key].Price,
                  collection[key].Category,
                  collection[key].Quantity,
                  collection[key].Size,
                  collection[key].time,
                  collection[key].Brand,
                  collection[key].Code,
                  collection[key].ExpDate,
                  collection[key].id
                )
              );
              //   loadedProducts.sort((a, b) => (a.time > b.time ? 1 : -1));
              //   console.log("to dispatch:", loadedProducts);
              // console.log("this is userid for owenr", userId);
              dispatch({
                type: SET_PRODUCT,
                products: loadedProducts.filter(
                  (prod) => prod.ownerId === userId
                ),
              });
            }
          });
        } catch (err) {
          throw err;
        }
      }
    });
  };
};
export const fetchAvailableProducts = () => {
  console.log("fetching available products Actions initiated");
  return async (dispatch) => {
    const events = dbP;
    try {
      await events.get().then((querySnapshot) => {
        // const collection = querySnapshot.forEach((doc) => {
        //   // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, " => ", doc.data());
        // });
        const collection = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        // console.log("this is collection FROM THE FETCH", collection);

        const addedProducts = collection;

        // for (const key in collection) {
        // addedProducts.push(
        //   new availableProduct(
        //     collection[0].Product,
        //     collection[0].Size,
        //     collection[0].Price,
        //     collection[0].Category,
        //     collection[0].code
        //   )
        // );
        // console.log("available products that were fetched", addedProducts);
        dispatch({
          type: SET_AVAILABLE_PRODUCT,
          availableProducts: addedProducts,
        });
      });
    } catch (err) {
      throw err;
    }
  };
};
export const fetchStoreName = () => {
  return async (dispatch) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userId = user.uid.toString();

        // if (firebase.auth().currentUser.uid === null) {
        console.log("aint not title");
        // } else {
        // const token = getState().auth.token;
        const events = dP;
        try {
          let loadedStore;
          events
            .doc(userId)
            .get()
            .then(function (doc) {
              if (doc.exists) {
                loadedStore = doc.data().StoreName;
                console.log(loadedStore);
                dispatch({ type: SET_STORE_NAME, storeName: loadedStore });
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });
        } catch (err) {
          throw err;
        }
      }
    });
  };
};

export const fetchOrders = () => {
  console.log("fetching ORDERS");
  return async (dispatch) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var userId = user.uid.toString();
        const events = db.doc(userId).collection("Orders");
        try {
          events.get().then((querySnapshot) => {
            const collection = querySnapshot.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            });
            const loadedOrders = [];

            for (const key in collection) {
              loadedOrders.push(
                new Order(
                  key,
                  collection[key].cartItems,
                  collection[key].totalAmount,
                  new Date(collection[key].date),
                  collection[key].checked,
                  collection[key].id
                )
              );
            }
            dispatch({ type: SET_ORDERS, orders: loadedOrders });
          });
        } catch (err) {
          throw err;
        }
      }
    });
  };
};

export const createProduct = (
  Title,
  Price,
  Category,
  Quantity,
  Size,
  Brand,
  Code
) => {
  // console.log(
  //   "forwarded updated data111",
  //   Title,
  //   Price,
  //   Category,
  //   Quantity,
  //   Size,
  //   Brand,
  //   Code
  // );

  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(1);

    // console.log("creating product to upload");
    try {
      await db
        .doc(userId)
        .collection("Member Products")
        .doc(Code)
        .set(
          {
            Title,
            Price: parseInt(Price),
            Category,
            Quantity: increment,
            Size,
            Brand,
            Code,
            ownerId: userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

      const events = db.doc(userId).collection("Member Products");
      await events
        .get()
        .then((querySnapshot) => {
          const collection = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });

          // console.log("on Create Collection Everything", collection);
          dispatch({
            type: CREATE_PRODUCT,
            productData: {
              id: collection[0].id,
              Title,
              ownerId: userId,
              Price,
              Category,
              Quantity,
              Size,
              Brand,
              time: collection[0].timestamp,
              Code,
              docTitle: collection[0].id,
            },
          });
        })
        .catch(function (error) {
          console.log("Error getting document: from 4", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const createOrder = (cartItems, totalAmount) => {
  console.log("Items from new order being created", cartItems, totalAmount);
  let checked;
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    // const increment = firebase.firestore.FieldValue.increment(1);
    const date = new Date();
    console.log("creating order to upload");
    try {
      await db.doc(userId).collection("Orders").doc().set(
        {
          cartItems,
          totalAmount,
          date: date.toISOString(),
          checked: false,
        }
        // { merge: true }
      );

      const events = db.doc(userId).collection("Orders");
      await events
        .get()
        .then((querySnapshot) => {
          const collection = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });

          // console.log("on Create Collection Everything", collection);
          dispatch({
            type: ADD_ORDER,
            orderData: {
              id: collection[0].id,
              items: cartItems,
              amount: totalAmount,
              date: date,
              checked: checked,
            },
          });
        })
        .catch(function (error) {
          console.log("Error getting document: from 4", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const removeAll = () => {
  return (dispatch) => {
    console.log("removing all items");
    dispatch({
      type: REMOVE_ORDER,
    });
  };
};

export const addedProduct = (
  newProduct,
  newSize,
  newPrice,
  newCategory,
  newBrand,
  code
) => {
  console.log("new product that is being updated", newProduct, code);

  return async (dispatch, getState) => {
    // const userId = firebase.auth().currentUser.uid;

    console.log("creating new product to be uploaded");
    try {
      await dbP.doc(code).set(
        {
          Product: newProduct,
          Size: newSize,
          Price: newPrice,
          Category: newCategory,
          Brand: newBrand,
          code,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      let Product = newProduct;
      let Size = newSize;
      let Price = newPrice;
      let Category = newCategory;
      let Brand = newBrand;
      console.log("QUICK TEST", Product, Size, Price);
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const addedRandProduct = (
  newProduct,
  newSize,
  newPrice,
  newCategory,
  newBrand,
  randCode
) => {
  console.log("randomized code with product:", newProduct, randCode);

  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;

    console.log("going to be creating a new product but with random code");
    try {
      await dbP.doc(randCode).set(
        {
          Product: newProduct,
          Size: newSize,
          Price: newPrice,
          Category: newCategory,
          Brand: newBrand,
          code: randCode,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      let Product = newProduct;
      let Size = newSize;
      let Price = newPrice;
      let Category = newCategory;
      let Brand = newBrand;
      console.log("QUICK TEST", Product, Size, Price);

      // const events = dbP
      // await events
      //   .get()
      //   .then((querySnapshot) => {
      //     const collection = querySnapshot.docs.map((doc) => {
      //       return { id: doc.id, ...doc.data() };
      //     });

      //     const newAddedProduct = collection;

      // console.log("on Create Collection Everything", collection);
      // dispatch({
      //   type: ADDED_PRODUCT,
      //   productData: {
      //     Product,
      //     Size,
      //     Price,
      //     Category,
      //     Brand,
      //     code,
      // id: collection[0].id,
      // Title,
      // ownerId: userId,
      // Price,
      // Category,
      // Quantity,
      // Size,
      // time: collection[0].timestamp,
      // Code,
      // docTitle: collection[0].id,
      //   },
      // });
      // })
      // .catch(function (error) {
      //   console.log("Error getting document: from 5", error);
      // });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const quantityUpdate = (
  Title,
  Price,
  Category,
  newQ,
  Size,
  Code,
  Quantity
) => {
  console.log(
    "forwarded new q stuff data111",
    Title,
    Price,
    Category,
    newQ,
    Size,
    Code
  );

  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(1);
    console.log("updating quantity amount to Firebase");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Quantity: newQ,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );

      const events = db.doc(userId).collection("Member Products");
      await events
        .get()
        .then((querySnapshot) => {
          const collection = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });

          // console.log("on Create Collection Everything", collection);
          dispatch({
            type: UPDATE_PRODUCT,
            productData: {
              id: collection[0].id,
              Title,
              ownerId: userId,
              Price,
              Category,
              Quantity,
              Size,
              time: collection[0].timestamp,
              Code,
              docTitle: collection[0].id,
            },
          });
        })
        .catch(function (error) {
          console.log("Error getting document: from 1", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const updateProducts = (
  Title,
  Price,
  Category,
  Quantity,
  Size,
  Code
) => {
  //   console.log("forwarded data", Title, Price, Quantity, Size, Code);
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(1);
    console.log("IMPORTANT USER ID TEST", userId);

    // console.log(userId);
    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Quantity: increment,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );

      const events = db.doc(userId).collection("Member Products");
      await events
        .get()
        .then((querySnapshot) => {
          const collection = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });

          //   console.log(
          //     "on Create Collection Everything",
          //     collection[0].timestamp
          //   );
          dispatch({
            type: UPDATE_PRODUCT,
            productData: {
              id: collection[0].id,
              Title,
              ownerId: userId,
              Price,
              Category,
              Quantity,
              Size,
              time: collection[0].timestamp,
              Code,
              docTitle: collection[0].id,
            },
          });
        })
        .catch(function (error) {
          console.log("Error getting document: from 2", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const orderQuantityUpdate = (cartItem) => {
  return async () => {
    console.log("check cartitem", cartItem.quantity);
    const subNum = cartItem.quantity;
    const Code = cartItem.productcode;
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(-subNum);

    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Quantity: increment,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const updateChecked = (newCart, id) => {
  return async () => {
    console.log("updated checked status", id, newCart);

    const userId = firebase.auth().currentUser.uid;

    try {
      await db.doc(userId).collection("Orders").doc(id).update(
        {
          cartItems: newCart,

          timestampUpdate1: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const iconCheck = (id) => {
  return async () => {
    const userId = firebase.auth().currentUser.uid;

    try {
      await db.doc(userId).collection("Orders").doc(id).update(
        {
          checked: true,

          timestampUpdated2: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const subProducts = (scannedUserProduct, subNum) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    const Code = scannedUserProduct.productcode;
    const increment = firebase.firestore.FieldValue.increment(-subNum);

    console.log("number to be subbed", increment);
    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Quantity: increment,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );

      //   const events = db.doc(userId).collection("Member Products");
      //   await events
      //     .get()
      //     .then((querySnapshot) => {
      //       const collection = querySnapshot.docs.map((doc) => {
      //         return { id: doc.id, ...doc.data() };
      //       });

      //       //   console.log(
      //       //     "on Create Collection Everything",
      //       //     collection[0].timestamp
      //       //   );
      //       dispatch({
      //         type: UPDATE_PRODUCT,
      //         productData: {
      //           id: collection[0].id,
      //           Title,
      //           ownerId: userId,
      //           Price,
      //           Category,
      //           Quantity,
      //           Size,
      //           time: collection[0].timestamp,
      //           Code,
      //           docTitle: collection[0].id,
      //         },
      //       });
      //     })
      //     .catch(function (error) {
      //       console.log("Error getting document: from 3", error);
      //     });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const titleUpdate = (newText, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new TITLE edit");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Title: newText,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const brandUpdate = (newText, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new brand edit");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Brand: newText,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const priceUpdate = (newText, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new price edit");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Price: newText,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const sizeUpdate = (newText, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new size edit");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Size: newText,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const expDateUpdate = (dateChanged, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new expdate edit");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).set(
        {
          ExpDate: dateChanged,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const categoryUpdate = (newText, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new category edit");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).update(
        {
          Category: newText,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const storeTitleUpdate = (storeName) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new store Title");
    try {
      await db.doc(userId).set(
        {
          StoreName: storeName,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const productDelete = (Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("Firebase Delete product");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).delete();
    } catch (err) {
      console.log(err.message);
    }
  };
};
