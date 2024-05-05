import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import GeneralHeader from '../components/GeneralHeader';
import { get, set, ref as dbRef, update } from 'firebase/database';

import { db, storage } from '../Connection/DB';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { shareAsync } from 'expo-sharing';
import * as Print from 'expo-print';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
export default Feedback = ({ route }) => {
    const params = route.params;
    console.log(params);
    const [recommendation, setRecommendation] = useState(params.recommendation || '');
    const [feedback, setFeedback] = useState('');
    const [pdf, setPdf] = useState('');
    const generatePdf = async () => {
        const html = `
        <html>
        <head>
        <style>
        body{
            font-family: Arial, sans-serif;
        }
        </style>
        </head>
        <body>
        <h2>Original Image</h2>
        <image src="${params.image} style='width:200px', 'height: 200px'"> 
        <h2>Segmented Image</h2>
        <image src="${params.segmented}" style='width:200px', 'height: 200px'">
        <h1>Feedback</h1>
        <h2>Recommendation</h2>
        <p>${recommendation}</p>
        <h2>Feedback</h2>
        <p>${feedback}</p>
        </body>
        </html>
        `;

        const file = await Print.printToFileAsync({ html });
        const response = await fetch(file.uri);
        const blob = await response.blob();
        console.log(blob);

        // await shareAsync(file.uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        const path = 'reports/' + params.patientId + '/' + params.reportId + '/feedback.pdf';
        uploadBytes(ref(storage, 'reports/' + params.patientId + '/' + params.reportId + '/feedback.pdf'), blob).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            getDownloadURL(ref(storage, 'reports/' + params.patientId + '/' + params.reportId + '/feedback.pdf')).then((url) => {
                console.log(url);
                setPdf(url);
                update(dbRef(db, 'reports/' + params.patientId + '/' + params.reportId), { recommendation, feedback, pdf: url, status: 'pending', segmented }).then(() => {
                    console.log('Data saved');
                }
                ).catch((error) => {
                    console.error('Error saving data:', error);
                }
                )
                
            })
        })
            .catch((error) => {
                console.error('Error uploading file:', error);
            }
            )



    }
    return (
        <View>
            <GeneralHeader title="Feedback" />
            <Text>Feedback</Text>
            <Text>{params.patientId}</Text>
            <Text>{params.reportId}</Text>
            <Image source={{ uri: params.image }} style={{ width: 200, height: 200 }} />
            <Image source={{ uri: params.segmented }} style={{ width: 200, height: 200 }} />


            <TextInput onChange={setRecommendation} value={recommendation} />
            <TextInput onChange={setFeedback} value={feedback}></TextInput>
            
            <Button onPress={generatePdf}>Generate PDF</Button>
            {pdf && <Text style={{ color: 'blue' }}
                onPress={() => Linking.openURL(pdf)}>
                Download PDF
            </Text>}
            

        </View>
    )
}