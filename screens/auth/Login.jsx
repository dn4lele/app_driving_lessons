import {
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
import { FIREBASE_AUTH } from "../../Firebase/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    try {
      setLoading(true);
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);

      alert("login success");
    } catch (error) {
      console.log(error);
      alert("login failed:" + error.message);
    } finally {
      setLoading(false);
    }
  };

  gotosignup = () => {
    navigation.navigate("register");
  };

  if (Platform.OS != "web")
    return (
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Text style={styles.Top}>Login</Text>
            <View style={styles.bottom}>
              <Text style={styles.welcome}>Welcome back</Text>
              <Text style={styles.secwelcome}>Log in to your account</Text>

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

                  <View style={styles.forgotplace}>
                    <Text style={styles.forgotTxt}>Forgot Password ?</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.loginbtn}
                    onPress={() => signIn()}
                  >
                    <Text style={styles.logintxt}>Login</Text>
                  </TouchableOpacity>

                  <View style={styles.bottombottom}>
                    <Text style={styles.donthave}>
                      Don't have an account ?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => gotosignup()}>
                      <Text style={styles.tosignup}>Sign up</Text>
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
          <Text style={styles.Top}>Login</Text>
          <View style={styles.bottom}>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.secwelcome}>Log in to your account</Text>

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

                <View style={styles.forgotplace}>
                  <Text style={styles.forgotTxt}>Forgot Password ?</Text>
                </View>

                <TouchableOpacity
                  style={styles.loginbtn}
                  onPress={() => signIn()}
                >
                  <Text style={styles.logintxt}>Login</Text>
                </TouchableOpacity>

                <View style={styles.bottombottom}>
                  <Text style={styles.donthave}>Don't have an account ? </Text>
                  <TouchableOpacity onPress={() => gotosignup()}>
                    <Text style={styles.tosignup}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </>
    );
};

export default Login;

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
    marginVertical: 20,
  },
  bottom: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    paddingLeft: 10,
    borderTopLeftRadius: 100,
    paddingTop: 60,
    alignItems: "center",
  },
  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    color: Color.primary,
  },
  secwelcome: {
    color: "gray",
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 20,
  },
  forgotTxt: {
    color: Color.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  tosignup: {
    color: Color.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  donthave: {
    color: "gray",
    fontSize: 12,
    fontWeight: "bold",
  },

  forgotplace: {
    alignItems: "flex-end",
    width: "80%",
    paddingRight: 16,
    marginBottom: 180,
  },
  loginbtn: {
    backgroundColor: Color.primary,
    width: "70%",
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logintxt: {
    color: "white",
    fontSize: FontSize.size_5xl,
    fontWeight: "bold",
  },
  bottombottom: {
    flexDirection: "row",
    marginTop: 20,
  },
});
