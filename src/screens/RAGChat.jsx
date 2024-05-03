import React, { useState } from 'react';
import { useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import GeneralHeader from '../components/GeneralHeader';

export default function RAGChat() {
    const webviewRef = useRef();



    return (
        <>
            <GeneralHeader title={" "} />
            <View style={styles.container}>


                <WebView
                    ref={webviewRef}
                    style={{
                        height: '100%',
                        width: "100%",
                    }}
                    source={{ uri: "https://huzaifa003.github.io/skinllama2interface/" }}

                />
                {/* <Button title="Send Query" onPress={sendQuery} /> */}

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    responseContainer: {
        flex: 1,
        marginTop: 20,
    },
    responseText: {
        fontSize: 16,
    }
});
