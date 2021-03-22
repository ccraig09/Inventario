import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Platform, View, Text } from "react-native";

// import Colors from "../constants/Colors";

const CustomHeaderButton = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <Text>Nuevo</Text> */}

      <HeaderButton
        {...props}
        IconComponent={FontAwesome}
        iconSize={28}
        color="#FF4949"
      />
    </View>
  );
};

export default CustomHeaderButton;
