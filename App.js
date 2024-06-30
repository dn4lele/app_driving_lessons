import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { UserProvider } from "./Context/UserContext";
import Stack from "./navigations/Stack";

const App = () => {
  return (
    <UserProvider>
      <Stack />
    </UserProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
