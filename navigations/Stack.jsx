import { StyleSheet, Text, View, StatusBar } from "react-native";
import React, { useEffect } from "react";
import Drawer from "./Drawer";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import { useState } from "react";
import { FontSize, Color, Border } from "../GlobalStyles";
//navigationContainer
import { NavigationContainer } from "@react-navigation/native";
//stack
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../Firebase/FirebaseConfig";
import { useUser, useSetUser, UserProvider } from "../Context/UserContext";

const stack = createNativeStackNavigator();

const Stack = () => {
  const [MyUser, setMyUser] = useState(null);

  const setUser = useSetUser();

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (MyUser) => {
      if (MyUser) {
        setUser(MyUser);
        setMyUser(MyUser);
      } else {
        setMyUser(null);
      }
    });
  }, []);

  return (
    <>
      <NavigationContainer>
        {MyUser ? (
          <stack.Navigator screenOptions={{ headerShown: false }}>
            <stack.Screen name="Drawer" component={Drawer} />
          </stack.Navigator>
        ) : (
          <stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="login"
          >
            <stack.Screen name="login" component={Login} />
            <stack.Screen name="register" component={Register} />
          </stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
};

export default Stack;

const styles = StyleSheet.create({});
