import { useConnect } from "@starknet-react/core";
import { Button, View } from "react-native";

export default function WalletConnect() {
  const { connect, connectors } = useConnect();
  return (
    <View>
      {connectors.map((connector) => (
        <li key={connector.id}>
          <Button
            onPress={() => connect({ connector })}
            title={`${connector?.name}`}
          />
        </li>
      ))}
    </View>
  );
}
