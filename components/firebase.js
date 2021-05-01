// import * as firebase from "firebase";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBBgdO_TcbM1SXV2BnL4xw985tuj5FGOK4",
  authDomain: "inventory-bd1be.firebaseapp.com",
  projectId: "inventory-bd1be",
  storageBucket: "inventory-bd1be.appspot.com",
  messagingSenderId: "635933145321",
  appId: "1:635933145321:web:fa384b6558644171ddd878",
  measurementId: "G-8V9EBD52LZ",
};
// if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
// }

export default firebase;
