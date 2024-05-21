import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
  contentContainer: {
    padding: 8,
  },
  listContainer: {
    width: "100%",
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});
