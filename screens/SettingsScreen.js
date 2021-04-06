import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as sendProduct from "../store/productActions";
import { useSelector, useDispatch } from "react-redux";

import { Avatar, Divider, Input, Button } from "react-native-elements";

import * as authActions from "../store/authAction";

const SettingsScreen = (props) => {
  const [storeName, setStoreName] = useState();
  const dispatch = useDispatch();
  const Tienda = props.navigation.getParam("StoreTitle");
  const createdStoreName = useSelector((state) => state.storeName.storeName);

  useEffect(() => {
    dispatch(sendProduct.fetchStoreName());
  }, []);

  const titleHandler = () => {
    let Title;
    dispatch(sendProduct.storeTitleUpdate(storeName));
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS == "ios" ? "height" : "height"}
      keyboardVerticalOffset={10}
    >
      <ScrollView>
        <View style={{ backgroundColor: "white", height: 200 }}>
          <View style={styles.avatar}>
            <Avatar
              rounded
              size="xlarge"
              style={{ width: 100, height: 100 }}
              source={{
                uri: null,
              }}
              showEditButton={true}
            />
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{storeName} </Text>
          </View>
        </View>
        <View style={{ backgroundColor: "#fff", marginTop: 8 }}>
          <View style={styles.Datos}>
            <Text style={styles.title}>Datos</Text>
            {/* <Text style={styles.category}>Nombre</Text> */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Input
                  style={{ width: 200, fontSize: 25 }}
                  label="Tienda:"
                  placeholder={createdStoreName}
                  placeholderTextColor={"silver"}
                  onChangeText={(value) => setStoreName(value)}
                />
                <Input
                  style={{ width: 200, fontSize: 25 }}
                  label="Nombre Completo:"
                  // placeholder={createdStoreName}
                  placeholderTextColor={"silver"}
                  // onChangeText={(value) => setStoreName(value)}
                />
                <Input
                  style={{ width: 200, fontSize: 25 }}
                  label="Num de celular:"
                  // placeholder={createdStoreName}
                  placeholderTextColor={"silver"}
                  // onChangeText={(value) => setStoreName(value)}
                />
                <Input
                  style={{ width: 200, fontSize: 25 }}
                  label="Correo Electronico:"
                  // placeholder={createdStoreName}
                  placeholderTextColor={"silver"}
                  // onChangeText={(value) => setStoreName(value)}
                />

                <View
                  style={{
                    // width: "100%",
                    height: "50%",
                    alignSelf: "center",
                    marginBottom: 10,
                    // justifyContent: "space-between",
                  }}
                >
                  <Button
                    title={"Guardar Cambios"}
                    // disabled={() => {
                    //   disableCheck(name, fName);
                    // }}
                    buttonStyle={{
                      borderRadius: 12,
                      backgroundColor: "green",
                      marginBottom: 10,
                    }}
                    onPress={() => {
                      Alert.alert(
                        "Guardar Cambios?",
                        `Cambia nombre de la Tienda a ${storeName}?`,
                        [
                          {
                            text: "No",
                            style: "cancel",
                          },
                          {
                            text: "Si",
                            onPress: () => titleHandler(storeName),
                          },
                        ]
                      );
                    }}
                  />
                  <Button
                    buttonStyle={{
                      borderRadius: 12,
                      backgroundColor: "#FF4949",
                    }}
                    title="Cerrar sesión"
                    onPress={() => {
                      Alert.alert("Cerrar sesión?", "", [
                        {
                          text: "No",
                          style: "default",
                        },
                        {
                          text: "Si",
                          style: "destructive",
                          onPress: () => {
                            dispatch(authActions.logout());
                            props.navigation.navigate("Auth");
                          },
                        },
                      ]);
                    }}
                  />
                </View>
              </View>
            </View>
            {/* <Divider style={{ backgroundColor: "black" }} /> */}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

SettingsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Configuraciones",
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  avatar: {
    alignItems: "center",
    marginTop: 30,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  editName: {},
  title: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  category: {
    color: "#C0C0C0",
    fontSize: 12,
    marginTop: 30,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    height: 300,
    width: "80%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  Datos: {
    backgroundColor: "#fff",
    marginLeft: 15,
    marginRight: 15,
    // flex: 1,
  },
});

export default SettingsScreen;
