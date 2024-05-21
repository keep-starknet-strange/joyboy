import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  card: {
    // backgroundColor: "#022b3a",
    width: "100%",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contentBox: {
    padding: 8,
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
  },
  authorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 14,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});
