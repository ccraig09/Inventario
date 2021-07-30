import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../components/firebase";
import { AuthContext } from "../navigation/AuthProvider";

const ExportScreen = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userProducts, setUserProducts] = useState();
  const [availableProducts, setAvailableProducts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      const startAvailableProducts = async () => {
        try {
          const list = [];
          await firebase
            .firestore()
            .collection("Products")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  Product,
                  Quantity,
                  Category,
                  Price,
                  Brand,
                  code,
                  Size,
                } = doc.data();
                list.push({
                  productId: doc.id,
                  Product,
                  Price,
                  Category,
                  Quantity,
                  Size,
                  Brand,
                  code,
                });
              });
            });
          setAvailableProducts(list);
        } catch (e) {
          console.log(e);
        }
        // setIsLoading(false);
      };
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
                  key: doc.id,
                  productTitle: Title,
                  productPrice: Price,
                  productCategory: Category,
                  productOwner: ownerId,
                  productQuantity: Quantity,
                  productSize: Size,
                  productBrand: Brand,
                  productcode: Code,
                  productExp: ExpDate,
                  docTitle: docTitle,
                });
              });
            });
          setUserProducts(list);
        } catch (e) {
          console.log(e);
        }
      };
      fetchPost();
      startAvailableProducts();
      setIsLoading(false);
    }, [])
  );

  const cell = () => {
    var ws = XLSX.utils.json_to_sheet(userProducts);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });
    const uri = FileSystem.cacheDirectory + "Productos.xlsx";
    console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
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
    <View>
      <TouchableOpacity onPress={() => cell()}>
        <Text>Export</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExportScreen;
