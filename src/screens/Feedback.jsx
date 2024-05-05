import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import GeneralHeader from '../components/GeneralHeader';
import { get } from 'firebase/database';
import { db } from '../Connection/DB';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
export default Feedback  = ({route})=>{
    const params = route.params;
    console.log(params);
    const [recommendation, setRecommendation] = useState(params.recommendation || '');
    const [feedback, setFeedback] = useState('');

    const generatePdf = async ()=>{
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

        const file = await Print.printToFileAsync({html});
        console.log(file.uri);


        

    }
    return (
        <View>
            <GeneralHeader title="Feedback" />
            <Text>Feedback</Text>
            <Text>{params.patientId}</Text>
            <Text>{params.reportId}</Text>
            <Image source={{uri:params.image}} style={{width: 200, height: 200}} /> 
            <Image source={{uri:params.segmented}} style={{width: 200, height: 200}} />


            <TextInput onChange={setRecommendation} value={recommendation} /> 
            <TextInput onChange={setFeedback} value={feedback}></TextInput>

            

        </View>
    )
}