import React, { useEffect, useState } from 'react';
import { Image, ScrollView, View, Alert } from 'react-native'; // Import Alert
import { auth, db } from '../Connection/DB';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider, TextInput, Button, Card, DefaultTheme, Text } from 'react-native-paper';
import { ref, set } from 'firebase/database';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#1C2A3A', // Darker indigo
        accent: '#FFC107', // Amber for contrast
        background: '#F5F5F6', // Light gray for general background
        surface: '#FFFFFF', // White for card surfaces
        text: '#333333', // Dark gray for text readability
    },
    fonts: {
        ...DefaultTheme.fonts,
        medium: {
            ...DefaultTheme.fonts.medium,
            fontSize: 18,
        },
    },
};

const AddProfile = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [summary, setSummary] = useState('');
    const [uid, setUid] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUid(user.uid);
            }
        });
    }, []);

    const navigation = useNavigation();
    const handleAddProfile = () => {
        if (!name || !age || !summary) {
            console.error('Please fill in all fields.');
            return;
        }
        const dbref = ref(db, `patients/${uid}/profile/`);
        set(dbref, {
            name: name,
            age: age,
            summary: summary,
        }).then(() => {
            // Show alert when profile is successfully added
            Alert.alert('Profile Information Added', 'Your profile information has been successfully added.');
        }).catch((error) => console.error('Error writing profile:', error));
    };

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={tw`flex-1 bg-[${theme.colors.background}]`}>
                <ScrollView contentContainerStyle={tw`w-full p-4 flex-grow`}>
                    <View style={tw`flex-row items-center mb-4`}>
                        <Image source={require('../../assets/Vector.png')} style={{ width: 40, height: 40 }} />
                        <Text style={{ marginLeft: 8, fontSize: 24, color: theme.colors.primary }}>DermCare</Text>
                    </View>
                    <Card style={{ backgroundColor: theme.colors.surface, marginBottom: 16 }}>
                        <Card.Title
                            title="Profile Information"
                            titleStyle={{ fontSize: 24, color: theme.colors.primary }}
                            left={() => <Icon name="account-details" size={30} color={theme.colors.primary} />}
                        />
                        <Card.Content>
                            <TextInput
                                label="Name"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                theme={{ colors: { text: theme.colors.text } }}
                                left={<TextInput.Icon name={() => <Icon name="account" size={20} color={theme.colors.primary} />} />}
                            />
                            <TextInput
                                label="Age"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                mode="outlined"
                                theme={{ colors: { text: theme.colors.text } }}
                                left={<TextInput.Icon name={() => <Icon name="calendar" size={20} color={theme.colors.primary} />} />}
                            />
                            <TextInput
                                label="Summary"
                                value={summary}
                                onChangeText={setSummary}
                                mode="outlined"
                                multiline
                                numberOfLines={4}
                                theme={{ colors: { text: theme.colors.text } }}
                                left={<TextInput.Icon name={() => <Icon name="information" size={20} color={theme.colors.primary} />} />}
                            />
                        </Card.Content>
                        <Card.Actions>
                            <Button mode="contained" onPress={handleAddProfile} style={tw`w-full`} color={theme.colors.primary}>
                                Add Profile
                            </Button>
                        </Card.Actions>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
};

export default AddProfile;