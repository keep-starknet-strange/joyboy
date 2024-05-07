import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
export const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { goBack } = useNavigation();

  const handleGoBack = () => {
    goBack();
  };

  return (
    <View
    // style={styles.tabBar}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <>
            <View 
            style={styles.container}
            >
              {/* <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.navigate("Home")}
              >
                <Text>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.navigate("Profile")}
              >
                <Text>Profile</Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                // style={styles.tab}
                key={route.key}
              >
                {label === "Back" ? (
                  <Button
                    title="Go back"
                    onPress={() => handleGoBack()}
                  />
                ) : (
                  <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
                    {label}
                  </Text>
                )}
              </TouchableOpacity> */}
            </View>
          </>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff", // Background color of the bottom bar
    borderTopWidth: 1,
    borderTopColor: "#ccc", // Border color
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  tab: {
    alignItems: "center",
  },
});
