import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, ScrollView, Linking } from 'react-native';
import { FAB, Portal, Provider, Modal, Button, Card, Title, Paragraph, Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import GeneralHeader from '../GeneralHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VisualSearch = () => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log('selectedImage:', selectedImage);
  }, [selectedImage]);


  const uploadImage = async (imageUri) => {
    setLoading(true);
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    let bytes;
    const res = await fetch(imageUri);
    const blob = await res.blob();

    console.log(blob);


    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    const headers = {
      'Ocp-Apim-Subscription-Key': '49e4bb3bd97e40249c196b678456227f',
      'Content-Type': 'multipart/form-data',
    };

    const imgs = await AsyncStorage.getItem('images');
    if (imgs) {
      setImages(JSON.parse(imgs));
      return;
      
    }
    console.log('images:', images)
    try {
      const response = await fetch('https://api.bing.microsoft.com/v7.0/images/visualsearch', {
        method: 'POST',
        body: formData,
        headers: {
          'Ocp-Apim-Subscription-Key': '49e4bb3bd97e40249c196b678456227f',
          'Content-Type': 'multipart/form-data' // This might be set automatically by fetch; some environments might require manual handling
        }

      });
      const data = await response.json();
      const images = data.tags[0].actions[2].data.value;
      console.log(images[0]);
      setImages(images);
      await AsyncStorage.setItem('images', JSON.stringify(images));

    } catch (error) {
      console.error("Error uploading image: ", error);
    }
    setLoading(false);
  };

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
    } else {
      Alert.alert('Report Results');
    }

    // Implement image processing logic here (e.g., send image to backend API)
    console.log('Processing image:', selectedImage);

    // Additional processing tasks can be added here
  };

  return (
    <Provider>
      <GeneralHeader title="Visual Search" />
      <ScrollView>
      <View style={styles.container}>
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} resizeMode="cover" />}

        <Button mode='contained' icon={'chart-timeline-variant-shimmer'} onPress={async () => { await uploadImage(selectedImage) }}>Generate Similar Images</Button>

        


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
        {loading ? <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" /> :
        
        <ScrollView >
          <Text variant="headlineMedium">Headline Medium</Text>
          {images.map((item, index) => (
            <>
            <Card key={index} style={styles.card}>
              {item.contentUrl && (
                <Card.Cover source={{ uri: item.contentUrl }} />
              )}
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
              <Card.Actions style={{ flex: 1, justifyContent: 'space-between' }}>

                <Text style={{ 'marginRight': 'auto' }}> {formatDate(item.datePublished)} </Text>
                <Button
                  icon="link"
                  mode="contained"
                  onPress={() => Linking.openURL(item.webSearchUrl)}
                  
                >
                  Show URL
                </Button>
                
                

              </Card.Actions>
            </Card>
            
            <Text id={index+'a'}/>
            </>
          ))}

        </ScrollView>
        }

        {/* {selectedImage && (
          <View style={styles.processButton}>
            <FAB icon="check" onPress={handleProcessImage} />
          </View>
        )} */}

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
            <Button onPress={handleSelectImage}>Choose from Gallery</Button>
            <Button onPress={handleCaptureImage}>Capture from Camera</Button>
          </Modal>
        </Portal>
      </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default VisualSearch;
