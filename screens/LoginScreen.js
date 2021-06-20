import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import SocialButton from "../components/SocialButton";
import { AuthContext } from "../navigation/AuthProvider";
// import { AuthContext } from "../navigation/AuthProvider";

const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { login } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../assets/prioriza.png")} style={styles.logo} />
      {/* <Text style={styles.text}>Prioriza</Text> */}

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Correo"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Contraseña"
        iconType="lock"
        secureTextEntry={true}
      />
      <View style={{width: '100%'}}>
      {isLoading ? (
        <ActivityIndicator size="small"  />
      ) : (
        <FormButton
          buttonTitle="Iniciar Sesión"
          onPress={() =>(
            setIsLoading(true), login(email, password))}
        />
      )
        }

      </View>


      <TouchableOpacity style={styles.forgotButton} onPress={() => props.navigation.navigate("Forgot")}
>
        <Text style={styles.navButtonText}>Olvidé mi contranseña</Text>
      </TouchableOpacity>

      <View>
        <SocialButton
          buttonTitle="Continuar con Gmail"
          btnType="google"
          color="#de4d41"
          backgroundColor="#f5e7ea"
          onPress={() => console.log("goog")}
        />
      </View>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => props.navigation.navigate("Signup")}
      >
        <Text style={styles.navButtonText}>
          No tienes una cuenta? Crear aqui
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// import { useDispatch } from "react-redux";

// export const AUTHENTICATE = "AUTHENTICATE";

// import firebase from "../components/firebase";

// import * as authActions from "../store/actions/auth";

// const LoginScreen = (props) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState();
//   const [isSignup, setIsSignUp] = useState(false);
//   const dispatch = useDispatch();

// const authenticate = (userId, token) => {
//   return (dispatch) => {
//     // dispatch(setLogoutTimer(expiryTime));
//     dispatch({ type: AUTHENTICATE, userId: userId, token: token });
//   };
// };

// const onLoginSuccess = () => {
//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       // console.log("this is authstatechange user  ", user);
//       const userRes = user.toJSON().stsTokenManager;
//       var token = userRes.accessToken.toString();
//       var userId = user.uid.toString();
//       // console.log("this is tkn", token);
//       console.log("this is id", userId);

//       dispatch(authenticate(userId, token));
//     }
//   });
//   props.navigation.navigate("Home");
// };

// const onLoginFailure = (errorMessage) => {
//   setErrorMessage(errorMessage), setIsLoading(false);
// };

// const signInWithEmail = async () => {
//   await firebase
//     .auth()
//     .signInWithEmailAndPassword(email, password)
//     .then(onLoginSuccess.bind(this))
//     .catch((error) => {
//       let errorCode = error.code;
//       let errorMessage = error.message;
//       if (errorCode == "auth/weak-password") {
//         onLoginFailure.bind(this)("Contraseña Debil!");
//       } else {
//         onLoginFailure.bind(this)(errorMessage);
//       }
//     });
// };

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

// if (isLoading) {
//   return (
//     <View style={styles.centered}>
//       <ActivityIndicator size="large" color={Colors.noExprimary} />
//       <Text>Cargando detalles del usuario</Text>
//     </View>
//   );
// }

// return (
//   <TouchableWithoutFeedback
//     onPress={() => {
//       Keyboard.dismiss();
//     }}
//   >
//     <View style={{ flex: 1 }}>
//       <KeyboardAvoidingView style={styles.container} behavior="padding">
//         <Text
//           style={{
//             fontSize: 32,
//             fontWeight: "700",
//             color: "gray",
//             marginTop: 20,
//           }}
//         >
//           Bienvenido
//         </Text>
//         <View style={styles.form}>
//           <TextInput
//             style={styles.input}
//             placeholder="Correo"
//             placeholderTextColor="#B1B1B1"
//             returnKeyType="next"
//             keyboardType="email-address"
//             textContentType="emailAddress"
//             value={email}
//             onChangeText={(email) => setEmail(email)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Contraseña"
//             placeholderTextColor="#B1B1B1"
//             returnKeyType="done"
//             textContentType="newPassword"
//             secureTextEntry={true}
//             value={password}
//             onChangeText={(password) => setPassword(password)}
//           />
//         </View>
//         <Text
//           style={{
//             fontSize: 18,
//             textAlign: "center",
//             color: "red",
//             width: "80%",
//           }}
//         >
//           {errorMessage}
//         </Text>
//         <TouchableOpacity
//           style={{ width: "86%", marginTop: 10 }}
//           onPress={() => signInWithEmail()}
//         >
//           <Text>Iniciar Sesión</Text>
//         </TouchableOpacity>
{
  /* <TouchableOpacity 
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
          </TouchableOpacity> */
}
//           <View style={{ marginTop: 10 }}>
//             <TouchableOpacity
//               onPress={() => {
//                 props.navigation.navigate("Signup");
//               }}
//             >
//               <Text
//                 style={{ fontWeight: "200", fontSize: 17, textAlign: "center" }}
//               >
//                 No Tienes cuenta?
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// LoginScreen.navigationOptions = {
//   title: "Bienvenido",
//   headerShown: false,
// };

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Kufam-SemiBoldItalic",
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
    fontFamily: "Lato-Regular",
  },
});
