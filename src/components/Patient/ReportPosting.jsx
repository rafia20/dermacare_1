import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../Connection/DB';
import Loading from '../Loading';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure this package is installed for icons

const ReportPosting = () => {
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid("perpHAw783g5Oc6AgVxxeSaY4F03");
            }
        });
    }, []);

    const handleChoosePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    async function handleSendData() {
        if (uid && image) {
            setLoading(true);
            const currentTime = Date.now();
            const imagePath = `images/${uid}/reports/${currentTime}/`;
            const imageStorageRef = storageRef(storage, imagePath);

            try {
                const response = await fetch(image);
                const blob = await response.blob();
                await uploadBytes(imageStorageRef, blob);
                const url = await getDownloadURL(imageStorageRef);
                await set(dbRef(db, `/patients/${uid}/reports/${currentTime}`), {
                    user: uid,
                    image: url,
                    status: "pending",
                    description: description,
                });
                navigation.navigate('AllReports');
            } catch (error) {
                console.error("Error during the upload or save process: ", error);
                Alert.alert('Upload Failed', 'An error occurred during the upload. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            console.error("Missing user or image data.");
            alert('Missing Data', 'Please ensure you are logged in and an image has been captured.');
        }
    }

    return (
        <View style={styles.container}>
            {loading ? <Loading /> : null}
            <Text style={styles.title}>Get Disease Diagnosed</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter skin disease symptoms"
                multiline
                numberOfLines={4}
                onChangeText={setDescription}
                value={description}
            />
            <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
                <MaterialCommunityIcons name="camera" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Choose Photo</Text>
            </TouchableOpacity>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.preview}
                />
            )}
            <TouchableOpacity style={styles.button} onPress={handleSendData}>
                <MaterialCommunityIcons name="send" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Submit Report</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#1C2A3A', // Updated button color
        flexDirection: 'row', // Align icon and text horizontally
        justifyContent: 'center', // Center icon and text
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10, // Space between icon and text
    },
    preview: {
        width: 300,
        height: 300,
        marginBottom: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    }
});

export default ReportPosting;