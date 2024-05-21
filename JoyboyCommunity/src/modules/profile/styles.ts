import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    width: "100%",

    paddingHorizontal: 4,
    flexDirection: "row",
    borderBottomColor: "#e4e4e7",
    borderBottomWidth: 1,
  },
  tabItem: {
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "flex-start",
  },
});
