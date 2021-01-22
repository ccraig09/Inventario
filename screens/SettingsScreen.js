import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  //   Button,
  Platform,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import * as sendProduct from "../store/productActions";
import { useSelector, useDispatch } from "react-redux";

import { Avatar, Divider, Input, Button } from "react-native-elements";

const SettingsScreen = (props) => {
  const [storeName, setStoreName] = useState();
  const dispatch = useDispatch();
  const Tienda = props.navigation.getParam("StoreTitle");

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
        <View style={{ backgroundColor: "white", marginTop: 8 }}>
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
                  label="Tienda"
                  placeholder={Tienda}
                  placeholderTextColor={"silver"}
                  onChangeText={(value) => setStoreName(value)}
                />

                <View
                  style={{
                    alignSelf: "center",
                    marginBottom: 10,
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
    backgroundColor: "white",
    marginLeft: 15,
    marginRight: 15,
  },
});

export default SettingsScreen;
