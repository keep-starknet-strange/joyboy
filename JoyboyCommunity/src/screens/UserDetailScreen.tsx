// screens/PostDetailScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
type UserDetailScreenRouteProp = RouteProp<RootStackParamList, 'UserDetailScreen'>;

type UserDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserDetailScreen'>;

type Props = {
  route: UserDetailScreenRouteProp;
  navigation: UserDetailScreenNavigationProp;
};

const UserDetailScreen: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;

  // Fetch user based on userId pubkey
  return (
    <View>
      <Text>Uder Detail Screen</Text>
      <Text>User ID: {userId}</Text>
      {/* Render user details here */}
    </View>
  );
};

export default UserDetailScreen;
