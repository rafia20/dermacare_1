import React, { useEffect, useState } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, ref, set, onValue, remove } from 'firebase/database';
import { db } from '../Connection/DB';
import { useNavigation } from '@react-navigation/native'; // Ensure you have react-navigation installed and set up

const Chat = ({ route }) => {
    const navigation = useNavigation();
    const { reportId, patientId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        AsyncStorage.getItem("role").then(role => setUserRole(role || "derm"));

        const messagesRef = ref(db, `patients/${patientId}/reports/${reportId}/chat`);
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val() || {};
            const parsedMessages = Object.entries(data).map(([key, value]) => ({
                ...value,
                timestamp: new Date(key).toLocaleString(),
            }));
            setMessages(parsedMessages.sort().reverse());
        });

        // return () => remove(messagesRef);
    }, []);

    const sendMessage = async () => {
        const timestamp = new Date();
        const messageRef = ref(db, `patients/${patientId}/reports/${reportId}/chat/${timestamp}`);
        set(messageRef, {
            message: newMessage,
            userId: patientId,
            role: await AsyncStorage.getItem("role") || "derm",
        }).then(() => {console.log('Message sent!');})
            .catch((error) => console.error(error))
            .finally(() => setNewMessage(''));
        setNewMessage('');
    };

    const renderMessage = (item) => {
        const isUserRole = item.role === userRole;
        const cardStyle = isUserRole ? 'bg-blue-100' : 'bg-gray-100';
        const textStyle = isUserRole ? 'text-blue-500 font-bold' : '';

        return (
            <Card style={tw`m-2 p-4 rounded-lg shadow ${cardStyle}`}>
                <Text style={[tw`${textStyle}`]}>{item.userId}</Text>
                <Text>{item.message}</Text>
                <Text>{item.timestamp}</Text>
                <Text>{item.role}</Text>
            </Card>
        );
    };

    return (
        <SafeAreaView style={tw`flex-1`}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={tw`flex-1`}>
                <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => renderMessage(item)}
                    contentContainerStyle={tw`flex-grow`}
                    showsVerticalScrollIndicator={false}
                    inverted
                />
                <View style={tw`flex-row items-center p-2`}>
                    <TextInput
                        mode="outlined"
                        label="Type a message"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        style={tw`flex-1`}
                    />
                    <Button icon="send" mode="contained" onPress={sendMessage} style={tw`ml-2`}>
                        Send
                    </Button>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`absolute top-3 left-3`}>
                    <Text style={tw`text-lg`}>Back</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Chat;
