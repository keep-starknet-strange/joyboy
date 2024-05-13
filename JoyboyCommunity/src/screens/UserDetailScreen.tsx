import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useNostr } from "../hooks/useNostr";
import { Event as EventNostr } from "nostr-tools";
type UserDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "UserDetailScreen"
>;

type UserDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserDetailScreen"
>;

type Props = {
  route: UserDetailScreenRouteProp;
  navigation: UserDetailScreenNavigationProp;
};

/** @TODO fetch user */
const UserDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [eventProfile, setEventProfile] = useState<EventNostr | undefined>();
  const [imgUser, setImageUser] = useState<string | undefined>();

  const [contentParsed, setContentParsed] = useState<string | undefined>();
  const { getEvent, getUser } = useNostr();
  // Fetch user based on userId pubkey
  useEffect(() => {
    if (!eventProfile && userId) {
      handleGetEventById();
    } else if (eventProfile) {
      // queryProfile(userId)
    }
  }, [eventProfile, userId]);
  const handleGetEventById = async () => {
    console.log("handleGetEventById try get event");
    let event = await getEvent(userId);
    console.log("event", event);
    let eventUser = await getUser(userId);
    console.log("eventUser", eventUser);
    setEventProfile(event);
    return event;
  };
  const handleProfilePress = (userId: string) => {
    navigation.navigate("UserDetailScreen", { userId });
  };

  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
        // numberOfLines={1}
        lineBreakMode="tail"
      >
        User ID: {userId}
      </Text>
      <Image
        source={imgUser ?? require("../../assets/joyboy-logo.png")}
        style={{ width: 50, height: 50 }}
      />
      {/* Render user details here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#022b3a",
    height: "100%",
    color: "white",
    padding: 4,
  },
  text: {
    color: "white",
  },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default UserDetailScreen;
