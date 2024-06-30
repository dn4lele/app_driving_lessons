import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Home from "../screens/main/Home";
import Newlesson from "../screens/main/Newlesson";
import FutureClasses from "../screens/main/FutureClasses";
import Historylesson from "../screens/main/Historylesson";
import Payments from "../screens/main/Payments";
import Profile from "../screens/main/Profile";

//drawer
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer";

//icons
import AntDesign from "@expo/vector-icons/AntDesign";
import { Color } from "../GlobalStyles";

const drawer = createDrawerNavigator();

const Drawer = () => {
  return (
    <drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="Home"
      screenOptions={{
        drawerLabelStyle: { marginLeft: -25 },
        drawerActiveTintColor: Color.primary,

        headerTintColor: "white",
        headerTitle: "Yaron Drivers",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 30,
        },
        //i want the top will be radius at the left and the bottom at the right
        //to the top nav
        headerStyle: {
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,

          backgroundColor: Color.primary,
        },
      }}
    >
      <drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: () => <AntDesign name="home" size={22} color="black" />,
        }}
      />

      <drawer.Screen
        name="schedule New Lesson"
        component={Newlesson}
        options={{
          drawerIcon: () => (
            <AntDesign name="calendar" size={22} color="black" />
          ),
        }}
      />
      <drawer.Screen
        name="FutureClasses"
        component={FutureClasses}
        options={{
          drawerIcon: () => <AntDesign name="Trophy" size={22} color="black" />,
        }}
      />
      <drawer.Screen
        name="Historylesson"
        component={Historylesson}
        options={{
          drawerIcon: () => (
            <AntDesign name="solution1" size={22} color="black" />
          ),
        }}
      />
      <drawer.Screen
        name="payments"
        component={Payments}
        options={{
          drawerIcon: () => (
            <AntDesign name="linechart" size={22} color="black" />
          ),
        }}
      />
      <drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: () => <AntDesign name="user" size={22} color="black" />,
        }}
      />
    </drawer.Navigator>
  );
};

export default Drawer;

const styles = StyleSheet.create({});
