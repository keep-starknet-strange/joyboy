import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity } from "react-native";
import { RootStackNavigationProps } from "../../types";

export type AvatarProps = {
  userId: string;
  source?: string;
};

export const Avatar: React.FC<AvatarProps> = ({ source, userId }) => {
  const navigation = useNavigation<RootStackNavigationProps>();

  const handleProfilePress = () => {
    navigation.push("UserDetail", { userId });
  };

  return (
    <TouchableOpacity onPress={handleProfilePress}>
      <Image
        source={source ?? require("../../../assets/joyboy-logo.png")}
        style={{ width: 44, height: 44 }}
      />
    </TouchableOpacity>
  );
};
