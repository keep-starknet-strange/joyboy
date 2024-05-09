// screens/PostDetailScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
type PostDetailScreenRouteProp = RouteProp<RootStackParamList, 'NoteDetailScreen'>;

type PostDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NoteDetailScreen'>;

type Props = {
  route: PostDetailScreenRouteProp;
  navigation: PostDetailScreenNavigationProp;
};

const PostDetailScreen: React.FC<Props> = ({ route }) => {
  const { noteId } = route.params;

  // Fetch post details based on postId or use any other logic

  return (
    <View>
      <Text>Post Detail Screen</Text>
      <Text>Post ID: {noteId}</Text>
      {/* Render post details here */}
    </View>
  );
};

export default PostDetailScreen;
