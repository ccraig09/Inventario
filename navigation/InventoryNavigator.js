import { Platform } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import HomeScreen from "../screens/HomeScreen";
import SelectScreen from "../screens/SelectScreen";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import SignupScreen from "../screens/SignupScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ScannerScreen from "../screens/ScannerScreen";
import MenuScreen from "../screens/MenuScreen";
import OrderScreen from "../screens/OrdersScreen";

const InventoryNavigator = createStackNavigator({
  Loading: LoadingScreen,
  Login: LoginScreen,
  Signup: SignupScreen,
  // HomeStaks: HomeStack,
});

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Scan: SelectScreen,
  Settings: SettingsScreen,
  Scanner: ScannerScreen,
  Menu: MenuScreen,
  Order: OrderScreen,
});

const Main = createSwitchNavigator({
  Start: InventoryNavigator,
  HomeStax: HomeStack,
});
export default createAppContainer(Main);
