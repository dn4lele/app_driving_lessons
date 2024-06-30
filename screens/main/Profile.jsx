import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Color } from "../../GlobalStyles";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useUser, useSetUser } from "../../Context/UserContext";
import { FIREBASE_DB } from "../../Firebase/FirebaseConfig";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FontSize } from "../../GlobalStyles";

const Profile = ({ navigation }) => {
  const user = useUser();
  const setUser = useSetUser();

  const getUser = async () => {
    try {
      const docRef = doc(FIREBASE_DB, "users", user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setEmail(docSnap.data().email);
        setUsername(docSnap.data().username);
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, []);

  async function changeUserInDb() {
    if (username === "") {
      alert("Username is empty");
      return;
    }
    //change only the username
    const docRef = doc(FIREBASE_DB, "users", user.email);
    await setDoc(docRef, { username: username }, { merge: true });
    alert("username changed");
  }

  const [email, setEmail] = useState("email");
  const [username, setUsername] = useState("");
  return (
    <View>
      <View
        style={{
          backgroundColor: Color.primary2,
          width: "100%",
          height: 350,
          borderBottomRightRadius: 50,
          borderBottomLeftRadius: 50,
          position: "absolute",
          top: -50,
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
      <View
        style={{
          backgroundColor: Color.primary,
          width: "100%",
          height: 350,
          borderBottomRightRadius: 50,
          borderBottomLeftRadius: 50,
          position: "absolute",
          top: -100,
        }}
      ></View>
      <View
        style={{ justifyContent: "center", alignItems: "center", padding: 50 }}
      >
        <FontAwesome name="user-circle-o" size={150} color="black" />
        <Text style={{ fontSize: 30, color: "white" }}>{email}</Text>
      </View>
      <View
        style={{
          paddingTop: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Username"
          autoCapitalize="none"
          placeholderTextColor={Color.primary}
          secureTextEntry={false}
          style={styles.input}
        ></TextInput>

        <TouchableOpacity
          style={styles.savesBtn}
          onPress={() => changeUserInDb()}
        >
          <Text style={styles.savetxt}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  input: {
    borderRadius: 100,
    color: Color.primary,

    paddingHorizontal: 10,
    width: "70%",
    backgroundColor: "rgb(220,220,220)",
    marginTop: 20,
    marginBottom: 10,
    height: 40,
  },

  savesBtn: {
    backgroundColor: Color.primary,
    width: "70%",
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  savetxt: {
    color: "white",
    fontSize: FontSize.size_5xl,
    fontWeight: "bold",
  },
});
