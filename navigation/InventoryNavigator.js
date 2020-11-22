import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import HomeScreen from "../screens/HomeScreen";
import ScanScreen from "../screens/ScanScreen";

const InventoryNavigator = createStackNavigator({
  Home: HomeScreen,
  Scan: ScanScreen,
});
export default createAppContainer(InventoryNavigator);
