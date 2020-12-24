export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
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

export const createProduct = (Title, Price, Category, Quantity, Size, Code) => {
  console.log(
    "forwarded data111",
    Title,
    Price,
    Category,
    Quantity,
    Size,
    Code
  );

  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const increment = firebase.firestore.FieldValue.increment(1);

    console.log("creating product to upload");
    try {
      await db.doc(Code).set(
        {
          Title,
          Price,
          Category,
          Quantity: increment,
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
export const quantityUpdate = (
  Title,
  Price,
  Category,
  newQ,
  Size,
  Code,
  Quantity
) => {
  console.log("forwarded data111", Title, Price, Category, newQ, Size, Code);

  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const increment = firebase.firestore.FieldValue.increment(1);

    console.log("updating quantity amount to Firebase");
    try {
      await db.doc(Code).update(
        {
          Quantity: newQ,

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
          console.log("Error getting document:", error);
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
    const userId = getState().auth.userId;
    const increment = firebase.firestore.FieldValue.increment(1);

    // console.log(userId);
    try {
      await db.doc(Code).update(
        {
          Quantity: increment,

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
          console.log("Error getting document:", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};
export const subProducts = (Title, Price, Category, Quantity, Size, Code) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const increment = firebase.firestore.FieldValue.increment(-1);

    console.log(Title, Price, Category, Quantity, Size, Code);
    try {
      await db.doc(Code).update(
        {
          Quantity: increment,

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
          console.log("Error getting document:", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
};
