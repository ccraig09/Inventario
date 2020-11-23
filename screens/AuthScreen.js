import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";

import firebase from "../components/firebase";

// import * as authActions from "../store/actions/auth";

const AuthScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isSignup, setIsSignUp] = useState(false);
  const dispatch = useDispatch();

  const onLoginSuccess = () => {
    props.navigation.navigate("Home");
  };

  const onLoginFailure = (errorMessage) => {
    setErrorMessage(errorMessage), setIsLoading(false);
  };

  const signInWithEmail = async () => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(onLoginSuccess.bind(this))
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          onLoginFailure.bind(this)("Contraseña Debil!");
        } else {
          onLoginFailure.bind(this)(errorMessage);
        }
      });
  };

  // const saveDataToStorage = (avatar, givenName, token, userId) => {
  //   AsyncStorage.setItem(
  //     "userData",
  //     JSON.stringify({
  //       avatar: avatar,
  //       token: token,
  //       userId: userId,
  //       givenName: givenName,
  //     })
  //   );
  // };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.noExprimary} />
        <Text>Cargando detalles del usuario</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: "gray",
              marginTop: 20,
            }}
          >
            Bienvenido
          </Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Correo"
              placeholderTextColor="#B1B1B1"
              returnKeyType="next"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#B1B1B1"
              returnKeyType="done"
              textContentType="newPassword"
              secureTextEntry={true}
              value={password}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              color: "red",
              width: "80%",
            }}
          >
            {errorMessage}
          </Text>
          <TouchableOpacity
            style={{ width: "86%", marginTop: 10 }}
            onPress={() => signInWithEmail()}
          >
            <Text>Iniciar Sesión</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity 
            style={{ width: "86%", marginTop: 10 }}
            onPress={() => this.signInWithFacebook()}>
            <View style={styles.button}>
              <Text
                style={{
                  letterSpacing: 0.5,
                  fontSize: 16,
                  color: "#FFFFFF"
                }}
              >
                Continue with Facebook
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ width: "86%", marginTop: 10 }}
            onPress={() => this.signInWithGoogle()}>
            <View style={styles.googleButton}>
              <Text
                style={{
                  letterSpacing: 0.5,
                  fontSize: 16,
                  color: "#707070"
                }}
              >
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity> */}
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("Signup");
              }}
            >
              <Text
                style={{ fontWeight: "200", fontSize: 17, textAlign: "center" }}
              >
                No Tienes cuenta?
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

AuthScreen.navigationOptions = {
  title: "Bienvenido",
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "86%",
    marginTop: 15,
  },
  logo: {
    marginTop: 20,
  },
  input: {
    fontSize: 20,
    borderColor: "#707070",
    borderBottomWidth: 1,
    paddingBottom: 1.5,
    marginTop: 25.5,
  },
  button: {
    backgroundColor: "#3A559F",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#707070",
  },
});

export default AuthScreen;
