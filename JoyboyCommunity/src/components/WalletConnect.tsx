import { useConnect } from "@starknet-react/core";
import { View } from "react-native";

export default function WalletConnect() {
  const { connect, connectors } = useConnect();
  return (
    <View>
      {connectors.map((connector) => (
        <li key={connector.id}>
          <button onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        </li>
      ))}
    </View>
  );
}
