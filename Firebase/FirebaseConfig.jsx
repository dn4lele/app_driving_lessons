// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo5qiQgKZe--04cdDiB4BtsRCT3ay4kyU",
  authDomain: "rndrivelessons.firebaseapp.com",
  projectId: "rndrivelessons",
  storageBucket: "rndrivelessons.appspot.com",
  messagingSenderId: "61509168292",
  appId: "1:61509168292:web:c3265b0a85c3c3eab6ca31",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
//export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
let FIREBASE_AUTH = null;
if (Platform.OS === "web") {
  FIREBASE_AUTH = getAuth(FIREBASE_APP);
} else {
  FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}
export { FIREBASE_AUTH };

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
