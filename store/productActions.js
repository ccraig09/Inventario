export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const ADDED_PRODUCT = "ADDED_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";
export const SET_AVAILABLE_PRODUCT = "SET_AVAILABLE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
import Product from "../models/product";
import availableProduct from "../models/availableProduct";

import firebase from "../components/firebase";

export const db = firebase.firestore().collection("Members");
export const dbP = firebase.firestore().collection("Products");

export const fetchProducts = () => {
  console.log("fetchProduct Actions initiated");
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    // const token = getState().auth.token;
    const events = db;
    try {
      await events.get().then((querySnapshot) => {
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
export const fetchAvailableProducts = () => {
  console.log("fetching available products Actions initiated");
  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    // const token = getState().auth.token;
    const events = dbP;
    try {
      await events.get().then((querySnapshot) => {
        const collection = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        console.log("this is collection FROM THE FETCH", collection[0].Product);

        const loadedProducts = [];

        // for (const key in collection) {
        loadedProducts.push(
          new availableProduct(
            collection[0].Product,
            collection[0].Size,
            collection[0].Price,
            collection[0].Category,
            collection[0].code
          )
        );
        console.log("available products that were fetched", loadedProducts);
        dispatch({
          type: SET_AVAILABLE_PRODUCT,
          aProducts: loadedProducts,
        });
      });
    } catch (err) {
      throw err;
    }
  };
};

export const createProduct = (Title, Price, Category, Quantity, Size, Code) => {
  console.log(
    "forwarded updated data111",
    Title,
    Price,
    Category,
    Quantity,
    Size,
    Code
  );

  return async (dispatch, getState) => {
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(1);

    console.log("creating product to upload");
    try {
      await db.doc(userId).set(
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

export const addedProduct = (
  newProduct,
  newSize,
  newPrice,
  newCategory,
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
          code,
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
            type: ADDED_PRODUCT,
            productData: {
              Product,
              Size,
              Price,
              Category,
              code,
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
      await db.doc(userId).update(
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
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(1);
    console.log("IMPORTANT USER ID TEST", userId);

    // console.log(userId);
    try {
      await db.doc(userId).update(
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
    const userId = firebase.auth().currentUser.uid;
    const increment = firebase.firestore.FieldValue.increment(-1);

    console.log(Title, Price, Category, Quantity, Size, Code);
    try {
      await db.doc(userId).update(
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
