import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
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
const UserDetailScreen: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  console.log("userId", userId);
  const [eventProfile, setEventProfile] = useState<EventNostr | undefined>();
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
    // console.log("eventUser", eventUser);
    setEventProfile(event);
    return event;
  };

  return (
    <View>
      <Text>Uder Detail Screen</Text>
      <Text>User ID: {userId}</Text>
      {/* Render user details here */}
    </View>
  );
};

export default UserDetailScreen;
