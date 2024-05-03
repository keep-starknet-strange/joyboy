// src/screens/ProfileScreen.js

import React from 'react';
import { View, Text, Button } from 'react-native';

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button title="Edit Profile" onPress={() => console.log('Edit profile')} />
    </View>
  );
}

export default ProfileScreen;
