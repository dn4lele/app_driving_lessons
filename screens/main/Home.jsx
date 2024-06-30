import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontSize, Color, Border } from "../../GlobalStyles";
import { useUser } from "../../Context/UserContext";
import { FIREBASE_DB } from "../../Firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Home = ({ navigation }) => {
  const [username, setUsername] = useState("username");

  function gotoNewLesson() {
    navigation.navigate("schedule New Lesson");
  }

  function gotoyoutube() {
    Linking.openURL(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
    ).catch((err) => console.error("Couldn't load page", err));
  }

  const user = useUser();

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
  }, []);

  return (
    <View>
      <Image
        source={require("../../assets/images/RedBgcar.jpg")}
        style={{
          left: 0,
          bottom: 200,
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      ></Image>

      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: "100%",
          top: 300,
          borderBlockColor: "black",
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          alignItems: "center",
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            fontSize: FontSize.size_base,
            paddingTop: 30,
            paddingBottom: 10,
          }}
        >
          hello{" "}
          <Text style={{ fontSize: FontSize.size_xl, fontWeight: "bold" }}>
            {username}
          </Text>
          , we glad you came back
        </Text>

        <Image
          source={require("../../assets/images/img2.png")}
          style={{
            width: 300,
            height: 150,
            borderRadius: 20,
          }}
        ></Image>

        <TouchableOpacity
          style={{
            backgroundColor: "#FFD0D2",
            width: 200,
            height: 50,
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
            bottom: 20,
          }}
          onPress={() => gotoyoutube()}
        >
          <Text style={{ fontSize: FontSize.size_base, fontWeight: "bold" }}>
            get more details
          </Text>
        </TouchableOpacity>

        <View
          style={{
            // borderWidth: 1,
            // borderColor: "black",
            width: "100%",
            height: 50,
            paddingTop: 50,
            paddingLeft: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => gotoNewLesson()}
          >
            <Image
              source={require("../../assets/images/clock.png")}
              style={{
                width: 40,
                height: 40,
              }}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
