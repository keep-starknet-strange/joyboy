// BottomBar.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import TopBar from "./TopBar";
import { useNavigation } from "@react-navigation/native";
const BottomBar = ({ navigation }) => {
  const { goBack } = useNavigation();

  const handleGoBack = () => {
    goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Home")}
        >
          <Text
          style={styles?.textTab}
          
          >Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Create")}
        >
          <Text
          style={styles?.textTab}
          >Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text
          style={styles?.textTab}
          >Profile</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#022b3a", // Background color of the bottom bar
    borderTopWidth: 1,
    borderTopColor: "#ccc", // Border color
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    // color:"#fff"
    color:"white"
    
  },
  tab: {
    alignItems: "center",
    color:"white"

  },
  textTab: {
    color:"white",
    fontSize:16
  },
});

export default BottomBar;
