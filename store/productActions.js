export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";
import Product from "../models/product";

import firebase from "../components/firebase";

export const db = firebase.firestore().collection("PRODUCTS");

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    try {
      const events = await db;
      events.get().then((querySnapshot) => {
        const collection = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        // console.log("this is collection", collection);

        const loadedProducts = [];

        for (const key in collection) {
          loadedProducts.push(
            new Product(
              key,
              collection[key].Title,
              collection[key].ownerId,
              collection[key].Price,
              collection[key].Quantity,
              collection[key].Size,
              collection[key].time,
              collection[key].Code,
              collection[key].id
            )
          );
          //   loadedProducts.sort((a, b) => (a.time > b.time ? 1 : -1));
          //   console.log("to dispatch:", loadedProducts);
          console.log("this is userid for owenr", userId);
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

export const createProduct = (Title, Price, Quantity, Size, Code) => {
  console.log("forwarded data111", Title, Price, Quantity, Size, Code);

  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    console.log("creating product to upload");
    try {
      await db.doc(Code).set(
        {
          Title,
          Price,
          Quantity,
          Size,
          Code,
          ownerId: userId,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      const events = db;
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
            type: CREATE_PRODUCT,
            productData: {
              id: collection[0].id,
              Title,
              ownerId: userId,
              Price,
              Quantity,
              Size,
              time: collection[0].timestamp,
              Code,
              docTitle: collection[0].id,
            },
          });
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const updateQuantity = (Title, Price, Quantity, Size, Code) => {
  console.log("forwarded data", Title, Price, Quantity, Size, Code);
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    // console.log(userId);
    try {
      await db.doc(Code).update(
        {
          Quantity,

          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        // { merge: true }
      );

      const events = db;
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
            type: CREATE_PRODUCT,
            productData: {
              id: collection[0].id,
              Title,
              ownerId: userId,
              Price,
              Quantity,
              Size,
              time: collection[0].timestamp,
              Code,
              docTitle: collection[0].id,
            },
          });
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};
