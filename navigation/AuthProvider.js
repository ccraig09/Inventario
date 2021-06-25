import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import firebase from "../components/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const db = firebase.firestore().collection("Members");
  const dbP = firebase.firestore().collection("Products");

  //  const userId = firebase.auth().currentUser.uid;
  // KZhQMNuejvhZwAxtQeNBsdwmdep1

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          try {
            await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
        forgotPassword: async (email) => {
          try {
            await firebase.auth().sendPasswordResetEmail(email);
            Alert.alert("Correo Enviado");
          } catch (e) {
            console.log(e);
          }
        },
        deleteProduct: async (key) => {
          try {
            console.log("Firebase Delete product", key);
            await db
              .doc(user.uid)
              .collection("Member Products")
              .doc(key)
              .delete();
          } catch (e) {
            console.log(e);
          }
        },
        addMemProd: async (Title, Price, Category, Size, Brand, Code) => {
          const increment = firebase.firestore.FieldValue.increment(1);

          try {
            console.log("adding product to member");
            await db
              .doc(user.uid)
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
                  ownerId: user.uid,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
              );
          } catch (e) {
            console.log(e);
          }
        },
        createProduct: async (
          newProduct,
          newSize,
          newPrice,
          newCategory,
          newBrand,
          code
        ) => {
          try {
            console.log("creating an available product");
            await dbP.doc(code).set(
              {
                Product: newProduct,
                Size: newSize,
                Price: parseInt(newPrice),
                Category: newCategory,
                Brand: newBrand,
                code,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          } catch (e) {
            console.log(e);
          }
        },
        qUpdate: async (newQ, code) => {
          try {
            console.log("updating quantity amount to Firebase");

            await db
              .doc(user.uid)
              .collection("Member Products")
              .doc(code)
              .update(
                {
                  Quantity: newQ,

                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                }
                // { merge: true }
              );
          } catch (e) {
            console.log(e);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
