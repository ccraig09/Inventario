import React, { useContext, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { AuthContext } from "../navigation/AuthProvider";

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState();

    const { forgotPassword } = useContext(AuthContext);
    
    const handlePassword = () => {
        forgotPassword(email)
        console.log('email sent')
        navigation.navigate('Login')
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.text}>Recuperar Contraseña</Text>
          <Text style={styles.caption}>Por favor introduce tu correo electrónico</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Correo"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

          <FormButton
              buttonTitle="Recuperar"
              onPress={() => ( handlePassword())}
      />

      
    </ScrollView>
  );
};


export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafd",
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontFamily: "Kufam-SemiBoldItalic",
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
    },
    caption: {
        fontWeight: "bold",
        fontSize: 15,
    color: 'grey'
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
    fontFamily: "Lato-Regular",
  },
  textPrivate: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 35,
    justifyContent: "center",
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "Lato-Regular",
    color: "grey",
  },
});
