import * as Keychain from 'react-native-keychain';

export const generatePassword = async (username: string, password: string) => {
  try {
    // Store the credentials
    await Keychain.setGenericPassword(username, password);

    try {
      // Retrieve the credentials
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log('Credentials successfully loaded for user ' + credentials.username);
      } else {
        console.log('No credentials stored');
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
    await Keychain.resetGenericPassword();
  } catch (e) {
    console.log('Error generatePassword', e);
  }
};

// Function to check if biometric authentication is supported
export const isBiometrySupported = async () => {
  try {
    const biometryType = await Keychain.getSupportedBiometryType();
    console.log('getSupportedBiometryType', biometryType);
    return !!biometryType;
  } catch (error) {
    console.log('Error checking biometry support:', error.message);
    return false;
  }
};

// Function to save credentials with biometric protection
export const saveCredentialsWithBiometry = async (username, password) => {
  try {
    console.log('saveCredentialsWithBiometry');
    await Keychain.setGenericPassword(username, password, {
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
    console.log('Credentials saved successfully with biometry protection in keychain');
    alert(JSON.stringify('Credentials saved successfully with biometry protection in keychain'));
  } catch (error) {
    console.log('Error saving credentials:', error.message);
    // Handle specific errors (e.g., user canceled biometric enrollment)
    if (error.name === 'BiometryEnrollmentCancel') {
      console.log('Biometric enrollment canceled by the user.');
      alert(JSON.stringify('Biometric enrollment canceled by the user.'));
    } else {
      console.log('Unknown error:', error);
    }
  }
};

// Function to retrieve credentials with biometric authentication
export const getCredentialsWithBiometry = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    });
    return credentials;
  } catch (error) {
    console.log('Error retrieving credentials:', error.message);
    // Handle specific errors (e.g., biometric authentication failed)
    if (error.message.includes('authentication failed')) {
      console.log('Biometric authentication failed.');
      alert(JSON.stringify('Biometric authentication failed.'));
    } else {
      console.log('Unknown error:', error);
      alert(JSON.stringify(error));
    }
    return null;
  }
};
