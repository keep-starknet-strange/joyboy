import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';

const CreatePasskeyScreen = () => {
  const createPasskey = async () => {
    try {
      // Generate a passkey (e.g., a random string)
      const passkey = generateRandomPasskey();

      // Store the passkey securely
      await Keychain.setInternetCredentials('auth', 'passkey', passkey);

      Alert.alert('Success', 'Passkey created successfully!');
    } catch (error) {
      console.error('Error creating passkey:', error);
      Alert.alert('Error', 'Failed to create passkey. Please try again.');
    }
  };

  const generateRandomPasskey = () => {
    // Generate a random passkey (you may use a more secure method)
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let passkey = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      passkey += charset[randomIndex];
    }
    return passkey;
  };

  return (
    <View>
      <Button title="Create Passkey" onPress={createPasskey} />
    </View>
  );
};

export default CreatePasskeyScreen;
