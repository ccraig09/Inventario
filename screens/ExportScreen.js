import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../components/firebase";
import { AuthContext } from "../navigation/AuthProvider";
import localization from "moment/locale/es-us";
import { extendMoment } from "moment-range";
import Moment from "moment";
import Colors from "../constants/Colors";
import * as ProdActions from "../store/productActions";
export const SET_ORDERS = "SET_ORDERS";
import Order from "../models/order";
import * as exportActions from "../store/exportOrdersActions";

import { useSelector, useDispatch } from "react-redux";
import { set } from "react-native-reanimated";

// import { writeFile, readFile } from "react-native-fs";

// import * as FileSaver from "file-saver";

const ExportScreen = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userProducts, setUserProducts] = useState();
  const [expOrders, setExpOrders] = useState();
  const moment = extendMoment(Moment);

  const dispatch = useDispatch();

  const reducedOrders = useSelector((state) => state.export.items);
  //   let sortedOrders = orders.sort((a, b) => (a.date < b.date ? 1 : -1));

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);

      const fetchPost = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Members")
            .doc(user.uid)
            .collection("Member Products")
            .orderBy("Title", "asc")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Title,
                  Quantity,
                  Category,
                  Price,
                  ownerId,
                  Brand,
                  Code,
                  ExpDate,
                  Size,
                  docTitle,
                } = doc.data();
                list.push({
                  //   key: doc.id,
                  productTitle: Title,
                  Precio: Price,
                  Categoria: Category,
                  //   productOwner: ownerId,
                  Cantidad: Quantity,
                  Tamaño: Size,
                  Marca: Brand,
                  productcode: Code,
                  Expiración: moment(ExpDate)
                    .locale("es", localization)
                    .format("D-MM-YYYY"),
                  //   docTitle: docTitle,
                });
              });
            });
          setUserProducts(list);
        } catch (e) {
          console.log(e);
        }
      };
      const fetchOrders = () => {
        console.log("fetching ORDERS");
        // async (dispatch) => {
        try {
          firebase
            .firestore()
            .collection("Members")
            .doc(user.uid)
            .collection("Orders")
            .get()
            .then((querySnapshot) => {
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
              console.log("colllllect");

              const values = userProducts;

              const uniqueValues = new Set(values.map((v) => v.name));

              if (uniqueValues.size < values.length) {
                console.log("duplicates found", uniqueValues);
              }

              const mixed = new Set(
                loadedOrders.map(({ productcode }) => productcode)
              );
              const combined = [
                ...loadedOrders,
                ...userProducts.filter(({ productcode }) =>
                  mixed.has(productcode)
                ),
              ];

              // console.log(
              //   "this should show a matching target ",
              //   combined.length
              // );

              const target = combined.filter(
                (title) =>
                  title.items[0].productcode ===
                  userProducts.filter(
                    (x, i, userProducts) => userProducts.indexOf(x) == i
                  )
              );

              console.log("this should show a matching target ", target);

              var total = target.map((item) => ({
                Total: item.items[0].quantity,
              }));
              console.log(total.reduce((n, { Total }) => n + Total, 0));

              // console.log(sum);
              dispatch(exportActions.addToExportOrders(loadedOrders));
              setExpOrders(
                loadedOrders.map((item) => ({
                  Productos: item.items
                    .map((title) => title.productTitle)
                    .toString(),
                  Cantidad: item.items
                    .map((quantity) => quantity.quantity)
                    .toString(),
                  Precio: item.items
                    .map((price) => price.productPrice)
                    .toString(),
                  Total: item.totalAmount,

                  Fecha: moment(item.date)
                    .locale("es", localization)
                    .format("D-MM-YYYY"),
                }))
              );
              // dispatch({ type: SET_ORDERS, orders: loadedOrders });
            });
        } catch (err) {
          throw err;
        }
        // };
      };

      fetchPost();
      fetchOrders();
      //   console.log("init load orders", expOrders);
      setIsLoading(false);
    }, [])
  );

  const inventoryExport = () => {
    var ws = XLSX.utils.json_to_sheet(userProducts);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `Informe_${Moment().format("D-MM-YYYY_h_mm_a")}`
    );
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    const uri =
      FileSystem.cacheDirectory +
      `Informe_${Moment().format("D-MM-YYYY_h_mm_a")}.xlsx`;
    // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
    FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });
    Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "MyWater data",
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  const salesExport = async () => {
    // await dispatch(ProdActions.fetchOrders());
    // setExpOrders();
    console.log("orders to export from reducer", reducedOrders);

    var ws = XLSX.utils.json_to_sheet(reducedOrders);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `Ventas${Moment().format("D-MM-YYYY_h_mm_a")}`
    );
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    const uri =
      FileSystem.cacheDirectory +
      `Ventas${Moment().format("D-MM-YYYY_h_mm_a")}.xlsx`;
    // console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
    FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });
    Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "MyWater data",
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => inventoryExport()}
      >
        <Text style={styles.buttonText}>Exportar Informe de Inventario</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.openButton} onPress={() => salesExport()}>
        <Text style={styles.buttonText}>Exportar Informe de Ventas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center",
  },
  openButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
});
export default ExportScreen;
