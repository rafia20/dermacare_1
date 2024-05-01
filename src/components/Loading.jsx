import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Loading = () => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', // Make the View position itself absolutely
    top: 0, // Start from the top of the screen
    left: 0, // Start from the left of the screen
    right: 0, // Stretch to the right of the screen
    bottom: 0, // Stretch to the bottom of the screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    justifyContent: 'center', // Center children vertically
    alignItems: 'center', // Center children horizontally,
    zIndex: 1000, // Ensure the loading screen is on top of everything
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // White background for the loading container
    borderRadius: 10, // Rounded corners for the container
    shadowOpacity: 0.75, // Shadow for the container (optional)
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
    elevation: 10, // Elevation for Android (optional)
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: '#0000ff', // Optional: adjust text color if needed
  },
});

export default Loading;
