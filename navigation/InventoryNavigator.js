import { Platform } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import HomeScreen from "../screens/HomeScreen";
import ScanScreen from "../screens/ScanScreen";
import AuthScreen from "../screens/AuthScreen";
import LoadingScreen from "../screens/LoadingScreen";
import SignupScreen from "../screens/SignupScreen";

const InventoryNavigator = createStackNavigator({
  Loading: LoadingScreen,
  Auth: AuthScreen,
  Signup: SignupScreen,
  HomeStaks: HomeStack,
});

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Scan: ScanScreen,
});

const Main = createSwitchNavigator({
  Start: InventoryNavigator,
  HomeStax: HomeStack,
});
export default createAppContainer(Main);
