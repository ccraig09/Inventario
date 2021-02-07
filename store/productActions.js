export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const ADDED_PRODUCT = "ADDED_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";
export const SET_AVAILABLE_PRODUCT = "SET_AVAILABLE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_STORE_NAME = "SET_STORE_NAME";
import Product from "../models/product";
import availableProduct from "../models/availableProduct";

import firebase from "../components/firebase";

export const db = firebase.firestore().collection("Members");
export const dbP = firebase.firestore().collection("Products");
export const dP = firebase.firestore().collection("Members");

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    console.log("fetchProduct Actions initiated");
    const userId = firebase.auth().currentUser.uid;
    // const token = getState().auth.token;
    try {
      const events = await db.doc(userId).collection("Member Products");
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
              collection[key].id
            )
          );
          //   loadedProducts.sort((a, b) => (a.time > b.time ? 1 : -1));
          //   console.log("to dispatch:", loadedProducts);
          // console.log("this is userid for owenr", userId);
          dispatch({
            type: SET_PRODUCT,
            products: loadedProducts.filter((prod) => prod.ownerId === userId),
          });
        }
      });
    } catch (err) {
      throw err;
    }
  };
};
export const fetchAvailableProducts = () => {
  // console.log("fetching available products Actions initiated");
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    // const token = getState().auth.token;
    const events = dbP;
    try {
      await events.get().then((querySnapshot) => {
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
  // console.log("FETCHING STORE NAME");
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    // const token = getState().auth.token;
    const events = dP;
    try {
      let loadedStore;
      await events
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
  console.log(
    "forwarded updated data111",
    Title,
    Price,
    Category,
    Quantity,
    Size,
    Brand,
    Code
  );

  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(1);

    console.log("creating product to upload");
    try {
      await db.doc(userId).collection("Member Products").doc(Code).set(
        {
          Title,
          Price,
          Category,
          Quantity: increment,
          Size,
          Brand,
          Code,
          ownerId: userId,
          timestamp: firebase.firestore.FieldValue.serverTimestamp().toString(),
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
              time: collection[0].timestamp.toString(),
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
    const userId = firebase.auth().currentUser.uid;

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
          timestamp: firebase.firestore.FieldValue.serverTimestamp().toString(),
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
export const subProducts = (Title, Price, Category, Quantity, Size, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(-1);

    console.log(Title, Price, Category, Quantity, Size, Code);
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
          console.log("Error getting document: from 3", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};

export const titleUpdate = (newText, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new title edit");
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
    console.log("updating new title edit");
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
    console.log("updating new title edit");
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
    console.log("updating new title edit");
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
export const categoryUpdate = (newText, Code) => {
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    console.log("updating new title edit");
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
