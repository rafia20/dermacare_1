import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { FAB, Portal, Provider, Modal, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const Booking = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log('selectedImage:', selectedImage);
  }, [selectedImage]);

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Media library permission:', permissionResult);

    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!', [{ text: 'OK' }]);
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log('Image picker result:', pickerResult.uri);

    if (!pickerResult.cancelled) {
      setSelectedImage(pickerResult.assets[0].uri);
      setModalVisible(false); // Close the modal after selecting an image
    }
  };

  const handleCaptureImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    console.log('Camera permission:', permissionResult);

    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera is required!', [{ text: 'OK' }]);
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log('Image picker result:', pickerResult.assets[0].uri);

    if (!pickerResult.cancelled) {
      setSelectedImage(pickerResult.assets[0].uri);
      setModalVisible(false); // Close the modal after capturing an image
    }
  };

  const handleProcessImage = () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image before processing.', [{ text: 'OK' }]);
      return;
    }else{
        Alert.alert('Report Results');
    }

    // Implement image processing logic here (e.g., send image to backend API)
    console.log('Processing image:', selectedImage);

    // Additional processing tasks can be added here
  };

  return (
    <Provider>
      <View style={styles.container}>
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" />}

        <FAB.Group
          open={false}
          icon={'plus'}
          actions={[
            { icon: 'file-image', label: 'Select from Gallery', onPress: () => setModalVisible(true) },
            { icon: 'camera', label: 'Capture from Camera', onPress: handleCaptureImage },
          ]}
          onStateChange={({ open }) => {
            if (open) {
              setModalVisible(true); // Open the modal when FAB group is open
            }
          }}
        />

        {selectedImage && (
          <View style={styles.processButton}>
            <FAB icon="check" onPress={handleProcessImage} />
          </View>
        )}

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
            <Button onPress={handleSelectImage}>Choose from Gallery</Button>
            <Button onPress={handleCaptureImage}>Capture from Camera</Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  processButton: {
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default Booking;
