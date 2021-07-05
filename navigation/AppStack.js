import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/HomeScreen";
// import ChatScreen from '../screens/ChatScreen';
// import ProfileScreen from '../screens/ProfileScreen';
import SelectScreen from "../screens/SelectScreen";
import ScannerScreen from "../screens/ScannerScreen";
import MenuScreen from "../screens/MenuScreen";
import OrdersScreen from "../screens/OrdersScreen";
import { DrawerContent } from "../screens/DrawerContent";
import ExportScreen from "../screens/ExportScreen";

// import MessagesScreen from '../screens/MessagesScreen';
// import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const FeedStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,

        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
        ),
      })}
    />
    <Stack.Screen
      name="Scanner"
      component={ScannerScreen}
      options={{
        title: "",
        headerBackTitle: "Volver",
      }}
    />
    <Stack.Screen
      name="Order"
      component={OrdersScreen}
      options={({ navigation }) => ({
        title: "Pedidos",
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
        ),
      })}
    />
  </Stack.Navigator>
);

const SettingsStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        title: "Configuraciones",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "white",
          shadowColor: "white",
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const SelectStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Select"
      component={SelectScreen}
      options={{
        title: "",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#2e64e515",
          shadowColor: "#2e64e515",
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const MenuStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Menu"
      component={MenuScreen}
      options={({ navigation }) => ({
        title: "Catálogo",
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
        ),
      })}
    />
  </Stack.Navigator>
);
const OrderStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Order"
      component={OrdersScreen}
      options={({ navigation }) => ({
        title: "Pedidos",
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
        ),
      })}
    />
  </Stack.Navigator>
);
const ExportStack = ({ navigation }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Exportar"
      component={ExportScreen}
      options={({ navigation }) => ({
        title: "Exportar",
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          </View>
        ),
      })}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Inicio"
        component={FeedStack}
        options={{
          drawerIcon: (props) => (
            <Icon
              name="home-sharp"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Catálogo"
        component={MenuStack}
        options={{
          drawerIcon: (props) => (
            <Icon
              name="book"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
            />
          ),
        }}
      />
      {/* <Drawer.Screen name="Menu" component={SelectStack} /> */}
      <Drawer.Screen
        name="Configuracions"
        component={SettingsStack}
        options={{
          drawerIcon: (props) => (
            <Icon
              name="settings"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Pedidos"
        component={OrderStack}
        options={{
          drawerIcon: (props) => (
            <Icon
              name="receipt"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Exportar"
        component={ExportStack}
        options={{
          drawerIcon: (props) => (
            <Icon
              name="receipt"
              size={25}
              backgroundColor="#fff"
              color="#FF4949"
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

//     <Stack.Screen
//       name="HomeProfile"
//       component={ProfileScreen}
//       options={{
//         title: '',
//         headerTitleAlign: 'center',
//         headerStyle: {
//           backgroundColor: '#fff',
//           shadowColor: '#fff',
//           elevation: 0,
//         },
//         headerBackTitleVisible: false,
//         headerBackImage: () => (
//           <View style={{marginLeft: 15}}>
//             <Ionicons name="arrow-back" size={25} color="#2e64e5" />
//           </View>
//         ),
//       }}
//     />

// const MessageStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen name="Messages" component={MessagesScreen} />
//     <Stack.Screen
//       name="Chat"
//       component={ChatScreen}
//       options={({route}) => ({
//         title: route.params.userName,
//         headerBackTitleVisible: false,
//       })}
//     />
//   </Stack.Navigator>
// );

// const ProfileStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="Profile"
//       component={ProfileScreen}
//       options={{
//         headerShown: false,
//       }}
//     />
//     <Stack.Screen
//       name="EditProfile"
//       component={EditProfileScreen}
//       options={{
//         headerTitle: 'Edit Profile',
//         headerBackTitleVisible: false,
//         headerTitleAlign: 'center',
//         headerStyle: {
//           backgroundColor: '#fff',
//           shadowColor: '#fff',
//           elevation: 0,
//         },
//       }}
//     />
//   </Stack.Navigator>
// );

// const AppStack = () => {
//   const getTabBarVisibility = (route) => {
//     const routeName = route.state
//       ? route.state.routes[route.state.index].name
//       : '';

//     if (routeName === 'Chat') {
//       return false;
//     }
//     return true;
//   };

//   return (
//     <Tab.Navigator
//       tabBarOptions={{
//         activeTintColor: '#2e64e5',
//       }}>
//       <Tab.Screen
//         name="Home"
//         component={FeedStack}
//         options={({route}) => ({
//           tabBarLabel: 'Home',
//           // tabBarVisible: route.state && route.state.index === 0,
//           tabBarIcon: ({color, size}) => (
//             <MaterialCommunityIcons
//               name="home-outline"
//               color={color}
//               size={size}
//             />
//           ),
//         })}
//       />
//       <Tab.Screen
//         name="Messages"
//         component={MessageStack}
//         options={({route}) => ({
//           tabBarVisible: getTabBarVisibility(route),
//           // Or Hide tabbar when push!
//           // https://github.com/react-navigation/react-navigation/issues/7677
//           // tabBarVisible: route.state && route.state.index === 0,
//           // tabBarLabel: 'Home',
//           tabBarIcon: ({color, size}) => (
//             <Ionicons
//               name="chatbox-ellipses-outline"
//               color={color}
//               size={size}
//             />
//           ),
//         })}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileStack}
//         options={{
//           // tabBarLabel: 'Home',
//           tabBarIcon: ({color, size}) => (
//             <Ionicons name="person-outline" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

export default AppStack;
