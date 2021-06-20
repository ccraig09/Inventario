import React, {  useContext } from "react";
import {View, StyleSheet, Image,Alert} from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { Avatar, Title, Caption, Paragraph, Drawer, Text, TouchableRipple, Switch, } from 'react-native-paper'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconIon from "react-native-vector-icons/Ionicons";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Colors from '../constants/Colors';
import { AuthContext } from "../navigation/AuthProvider";



export function DrawerContent(props) {
    const { user, logout } = useContext(AuthContext);

    return (
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <Image source={require("../assets/prioriza.png")} style={styles.logo} />
                    </View>
                </View>
                <Drawer.Section style={styles.drawerSection}>
                <Drawer.Item
                      icon={({color, size}) => (
                        <IconIon
                        name="home-sharp" 
                        color={Colors.primary}
                        size={size}
                        />
                    )}
                    label="Home"
                    onPress={() => {props.navigation.navigate('Inicio')}}
                />
                <Drawer.Item
                      icon={({color, size}) => (
                        <IconIon 
                        name="book" 
                        color={Colors.primary}
                        size={size}
                        />
                    )}
                    label="Catálogo"
                    onPress={() => {props.navigation.navigate('Catálogo')}}
                />
                <Drawer.Item
                      icon={({color, size}) => (
                        <IconIon 
                        name="settings" 
                        color={Colors.primary}
                        size={size}
                        />
                    )}
                    label="Configuracions"
                    onPress={() => {props.navigation.navigate('Configuracions')}}
                />
                <Drawer.Item
                      icon={({color, size}) => (
                        <IconIon 
                        name="receipt" 
                        color={Colors.primary}
                        size={size}
                        />
                    )}
                    label="Pedidos"
                    onPress={() => {props.navigation.navigate('Pedidos')}}
                />
                <Drawer.Item
                      icon={({color, size}) => (
                        <Icon5
                        name="file-export" 
                        color={Colors.primary}
                        size={size}
                        />
                    )}
                    label="Exportar"
                    onPress={() => {props.navigation.navigate('Exportar')}}
                />
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <Drawer.Item
                    icon={({ color, size }) => (
                        <Icon name='exit-to-app'
                        color={Colors.primary}
                        size={size}
                        />
                    )}
                label="Cerrar Sesión"
                onPress={() => {
                    Alert.alert("Cerrar sesión?", "", [
                      {
                        text: "No",
                        style: "default",
                      },
                      {
                        text: "Si",
                        style: "destructive",
                        onPress: () => {
                          logout();
                        },
                      },
                    ]);
                  }}
                />

            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userInfoSection: {
        paddingLeft: 10,
        justifyContent: 'center'
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    logo: {
        height: 150,
        width: 150,
        resizeMode: "contain",
      },
  });