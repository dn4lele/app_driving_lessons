import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { FontSize, Color, Border } from "../GlobalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FIREBASE_AUTH } from "../Firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useUser } from "../Context/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../Firebase/FirebaseConfig";

const CustomDrawer = (props) => {
  const user = useUser();
  const [username, setUsername] = useState("username");

  const getUserName = async () => {
    try {
      const docRef = doc(FIREBASE_DB, "users", user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserName();
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: Color.primary }}
      >
        <ImageBackground
          source={require("../assets/images/headDrawer.png")}
          style={{ padding: 20 }}
        >
          <Image
            source={require("../assets/images/userIcon.png")}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text style={{ color: "white", fontSize: FontSize.size_xl }}>
            {username}
          </Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View
        style={{ padding: 20, borderTopWidth: 1, borderBlockColor: "#ccc" }}
      >
        <TouchableOpacity
          onPress={() => {
            FIREBASE_AUTH.signOut();
          }}
          style={{
            backgroundColor: Color.primary,
            padding: 10,
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <AntDesign name="logout" size={22} color="white" />

            <Text style={{ color: Color.colorWhite }}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
