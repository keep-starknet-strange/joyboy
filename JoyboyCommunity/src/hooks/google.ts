import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Keychain from 'react-native-keychain';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.GOOGLE_CLIENT_ID,
});

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    
    // Store tokens securely
    await Keychain.setInternetCredentials('google', 'accessToken', userInfo.serverAuthCode);
    await Keychain.setInternetCredentials('google', 'idToken', userInfo.idToken);
    await Keychain.setGenericPassword('google', userInfo.serverAuthCode);
    await Keychain.setGenericPassword('google-id', userInfo.idToken);
    // Now you can use the tokens for Google API requests
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

// Retrieve tokens from Keychain
export const getGoogleTokens = async () => {
  try {
    // await Keychain.getGenericPassword('google', userInfo.serverAuthCode);
    // await Keychain.setGenericPassword('google-id', userInfo.idToken);
    // const accessToken = await Keychain.getGenericPassword('google', 'accessToken');
    // const idToken = await Keychain.getInternetCredentials('google', 'idToken');
    // return { accessToken, idToken };
  } catch (error) {
    console.error('Error retrieving Google tokens:', error);
    return null;
  }
};
