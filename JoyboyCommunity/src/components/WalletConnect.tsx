import { useConnect } from "@starknet-react/core";
import {
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";

export default function WalletConnect() {
  const { connect, connectors } = useConnect();
  return (
    <View style={styles?.container}>
      {connectors.map((connector) => {
        console?.log("connector id", connector?.id);
        return (
          <View key={connector.id} style={styles?.connectorContainer}>
            <TouchableOpacity>
              {/*FIX ISSUE */}
              {/* <Image

                source={`https://iconic.dynamic-static-assets.com/icons/sprite.svg#${connector.id.toLocaleLowerCase()}`}
                src={`https://iconic.dynamic-static-assets.com/icons/sprite.svg#${connector.id.toLocaleLowerCase()}`}
                style={{ width: 50, height: 50, borderRadius: 25 }}
                width={50}
                height={50}
              ></Image> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => connect({ connector })}
              style={styles?.connectorButton}
            >
              <Text style={styles?.textConnector}>{connector?.name} </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "space-between",
    // backgroundColor: "#fff",
    // backgroundColor:"#022b3a",
    // height: "100%",
    gap: 5,
  },
  connectorContainer: {
    // backgroundColor: "#022b3a",
    backgroundColor: "#04506B",
    padding: 5,
    minWidth: 100,
    borderRadius: 5,
    margin: 1,
    display: "flex",
  },
  connectorButton: {
    // backgroundColor: "#022b3a",
    backgroundColor: "#04506B",
    padding: 5,
    minWidth: 100,
    borderRadius: 5,
    margin: 1,
    display: "flex",
  },
  textConnector: {
    color: "white",
  },
  // container: {
  //   flex: 1,
  //   width: "100%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width: "100%",
  //   // backgroundColor: '#fff', // Background color of the top bar
  //   paddingTop: 30, // Adjust this value to add spacing if needed
  //   paddingBottom: 10,
  //   paddingHorizontal: 20,
  //   borderBottomWidth: 1,
  //   // borderBottomColor: '#ccc', // Border color
  //   alignItems: "center",
  // },
  listContainer: {
    width: "100%", // Ensure the FlatList occupies the entire width
    paddingHorizontal: 20, // Add horizontal padding to create space between items
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
