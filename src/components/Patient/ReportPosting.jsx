import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../Connection/DB';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '../Loading';
import { useNavigation } from '@react-navigation/native';



const ReportPosting = () => {
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [uid, setUid] = useState(''); // Add this line
    const [loading , setLoading] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            console.log(user)
            if (user) {
                setUid(user.uid);
            }
            else {
                setUid("perpHAw783g5Oc6AgVxxeSaY4F03"); //TODO: Remove this line
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
            "mediaTypes": "Images",
            "presentationStyle": "overFullScreen",
            
            quality: 1,
        });

        if (!result.canceled) {
            result.assets[0].mimeType = "image/jpeg";
            setImage(result.assets[0].uri);
        }
    };

    async function handleSendData() {
        console.log(uid);
        if (uid && image) {
            const curren = Date.now();
            const path = `images/${uid}/reports/${curren}/`;
            const imageStorageRef = storageRef(storage, path);
            console.log(imageStorageRef);
            try {
                setLoading(true)
                const response = await fetch(image);


                const blob = await response.blob();
                console.log(blob);

                await uploadBytes(imageStorageRef, blob);
                console.log("Image uploaded successfully!");
                getDownloadURL(imageStorageRef).then((url) => {
                    console.log(url);
                    set(dbRef(db, `/patients/${uid}/reports/${curren}`), {
                        user: uid,
                        image: url,
                        status: "pending",
                        description: description,
                    })
                        .then(() => {
                            console.log("Successfully updated");
                            setLoading(false)
                            navigation.navigate('AllReports');
                        }
                        )
                        .catch((error) => {
                            console.log(error);
                            setLoading(false)
                        });
                }
                );
                // setimage(null);
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
            {loading? <Loading/> : null}
         
            <Text style={styles.title}>Report Posting</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter description"
                multiline
                numberOfLines={4}
                onChangeText={setDescription}
                value={description}
            />
            <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
                <Text style={styles.buttonText}>Choose Photo</Text>
            </TouchableOpacity>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.preview}
                />
            )}
            <TouchableOpacity style={styles.button} onPress={handleSendData}>
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
        backgroundColor: '#f4f4f4', // Light gray background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333', // Dark gray for better contrast
    },
    input: {
        height: 100,
        borderColor: '#ddd', // Lighter border color
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        borderRadius: 5, // Rounded corners
        backgroundColor: '#fff', // White background for the input
    },
    button: {
        backgroundColor: '#5c67f2', // A soft blue for the button
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff', // White text on the button
        fontSize: 16,
        fontWeight: 'bold',
    },
    preview: {
        width: 300,
        height: 300,
        marginBottom: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd', // Adding border to the image
    }
});

export default ReportPosting;
