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
        console.log("this is collection", collection);

        const loadedProducts = [];

        for (const key in collection) {
          loadedProducts.push(
            new Product(
              key,
              collection[key].title,
              collection[key].ownerId,
              collection[key].price,
              collection[key].quantity,
              collection[key].size,
              collection[key].time,
              collection[key].id
            )
          );
          //   loadedProducts.sort((a, b) => (a.time > b.time ? 1 : -1));
          console.log("to dispatch:", loadedProducts);
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

export const createProduct = (title, price, quantity, size) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    console.log(userId);
    try {
      await db.doc().set(
        {
          title,
          ownerId: userId,
          price,
          quantity,
          size,
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

          console.log(
            "on Create Collection Everything",
            collection[0].timestamp
          );
          dispatch({
            type: CREATE_PRODUCT,
            productData: {
              id: collection[0].id,
              title,
              ownerId: userId,
              price,
              quantity,
              size,
              time: collection[0].timestamp,
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
