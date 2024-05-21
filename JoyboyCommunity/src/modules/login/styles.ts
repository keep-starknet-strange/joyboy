import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  logo: {
    width: 200,
    height: 200,
  },
  inputContainer: {
    marginVertical: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 4,
  },
  formContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 4,
  },
  input: {
    minHeight: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 16,
    // Shadow for better visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    marginVertical: 4,
  },
  inputFocused: {
    borderColor: "#007AFF", // Change border color when focused
  },
  text: {
    width: "100%",
    color: "white,",
  },
  textButton: {
    color: "white,",
  },
});
