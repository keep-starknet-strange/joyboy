// src/screens/FeedScreen.js

import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';

const postData = [
  { id: '1', content: 'Hello Joyboy World!', author: 'User1' },
  { id: '2', content: 'Another post in Joyboy', author: 'User2' }
];

function FeedScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FlatList
        data={postData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text>{`${item.author}: ${item.content}`}</Text>
        )}
      />
      <Button title="Post Something" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}

export default FeedScreen;
