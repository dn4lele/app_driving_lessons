import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import React from "react";
import { FontSize, Color, Border } from "../../GlobalStyles";
import { useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../Firebase/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection } from "firebase/firestore";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Confimpassword, setConfimpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    try {
      setLoading(true);
      if (password !== Confimpassword) {
        alert("password not match");
        return;
      }
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const payload = {
        email: response.user.email,
        uid: response.user.uid,
        username: response.user.email.split("@")[0],
      };
      await setDoc(doc(FIREBASE_DB, "users", payload.email), payload);
      console.log(response);
      alert("check your email!");
    } catch (error) {
      console.log(error);
      alert("login failed:" + error.message);
    } finally {
      setLoading(false);
    }
  };

  gotologin = () => {
    navigation.navigate("login");
  };

  if (Platform.OS != "web")
    return (
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Text style={styles.Top}>Register</Text>
            <Text style={styles.welcome}>Create a new account</Text>
            <View style={styles.bottom}>
              {loading ? (
                <>
                  <ActivityIndicator size="large" color={Color.primary} />
                </>
              ) : (
                <>
                  <TextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email / Username"
                    autoCapitalize="none"
                    placeholderTextColor={Color.primary}
                    secureTextEntry={false}
                    style={styles.input}
                  ></TextInput>

                  <TextInput
                    password={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Password"
                    autoCapitalize="none"
                    placeholderTextColor={Color.primary}
                    secureTextEntry={true}
                    style={styles.input}
                  ></TextInput>

                  <TextInput
                    password={Confimpassword}
                    onChangeText={(text) => setConfimpassword(text)}
                    placeholder="confirm Password"
                    autoCapitalize="none"
                    placeholderTextColor={Color.primary}
                    secureTextEntry={true}
                    style={styles.input}
                  ></TextInput>

                  <Text style={styles.spacing}></Text>

                  <TouchableOpacity
                    style={styles.signbtn}
                    onPress={() => signUp()}
                  >
                    <Text style={styles.signtxt}>SignUp</Text>
                  </TouchableOpacity>

                  <View style={styles.bottombottom}>
                    <Text style={styles.have}>Already have an account ?</Text>
                    <TouchableOpacity onPress={() => gotologin()}>
                      <Text style={styles.tosignup}>Log in</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  else
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.Top}>Register</Text>
          <Text style={styles.welcome}>Create a new account</Text>
          <View style={styles.bottom}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={Color.primary} />
              </>
            ) : (
              <>
                <TextInput
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Email / Username"
                  autoCapitalize="none"
                  placeholderTextColor={Color.primary}
                  secureTextEntry={false}
                  style={styles.input}
                ></TextInput>

                <TextInput
                  password={password}
                  onChangeText={(text) => setPassword(text)}
                  placeholder="Password"
                  autoCapitalize="none"
                  placeholderTextColor={Color.primary}
                  secureTextEntry={true}
                  style={styles.input}
                ></TextInput>

                <Text style={styles.spacing}></Text>

                <TouchableOpacity
                  style={styles.signbtn}
                  onPress={() => signUp()}
                >
                  <Text style={styles.signtxt}>SignUp</Text>
                </TouchableOpacity>

                <View style={styles.bottombottom}>
                  <Text style={styles.have}>Already have an account ?</Text>
                  <TouchableOpacity onPress={() => gotologin()}>
                    <Text style={styles.tosignup}>Log in</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </>
    );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.primary,
    flex: 1,
    alignItems: "center",
  },
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
  Top: {
    fontSize: 64,
    color: "white",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  bottom: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    paddingLeft: 10,
    borderTopRightRadius: 100,
    paddingTop: 60,
    alignItems: "center",
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    color: Color.colorWhite,
    marginBottom: 20,
  },
  tosignup: {
    color: Color.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  have: {
    color: "gray",
    fontSize: 12,
    fontWeight: "bold",
  },
  signbtn: {
    backgroundColor: Color.primary,
    width: "70%",
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signtxt: {
    color: "white",
    fontSize: FontSize.size_5xl,
    fontWeight: "bold",
  },
  bottombottom: {
    flexDirection: "row",
    marginTop: 20,
  },
  spacing: {
    marginBottom: 200,
  },
});
