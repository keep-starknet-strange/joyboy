// src/screens/SplashScreen.js

import React from "react";
import { View, Text, Image, StyleSheet, StatusBar } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#022b3a" barStyle="light-content" />
      <Image
        source={require("../../assets/joyboy-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>Social network, unchained,</Text>
      <Text style={styles.text}>with freedom as it's core.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#022b3a",
  },
  logo: {
    width: 200,
    height: 200,
  },
  text: {
    color: "white",
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
});

export default SplashScreen;
