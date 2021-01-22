import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View, Text } from "react-native";

// import Colors from "../constants/Colors";

const CustomHeaderButton = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
      }}
    >
      {/* <Text>Nuevo</Text> */}

      <HeaderButton
        {...props}
        IconComponent={Ionicons}
        iconSize={28}
        color="grey"
      />
    </View>
  );
};

export default CustomHeaderButton;
