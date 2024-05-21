import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    // flex: 1,
    height: 350,
    color: "white",
    // padding: 4,
    gap: 4,
    flex: 0.9,
  },
  tabContainer: {
    // flex: 1,
    padding: 4,
    gap: 4,
    flex: 0.9,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileContainer: {
    paddingHorizontal: 12,
    gap: 4,
    padding: 8,
  },
  text: {
    color: "black",
    fontSize: 16,
    textAlign: "left",
    marginBottom: 20,
    width: "100%",
  },
  listContainer: {
    width: "100%",
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
