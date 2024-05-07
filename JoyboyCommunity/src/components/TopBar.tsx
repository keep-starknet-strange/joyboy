// TopBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TopBar = () => {
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Your App Name</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:"100%",
    // backgroundColor: '#fff', // Background color of the top bar
    paddingTop: 30, // Adjust this value to add spacing if needed
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    // borderBottomColor: '#ccc', // Border color
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TopBar;
