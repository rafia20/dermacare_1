import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import GeneralHeader from '../GeneralHeader';
import PieComponent from '../PieChart';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export default function Classification({ route }) {
    const navigation = useNavigation();
    
    const genAI = new GoogleGenerativeAI("AIzaSyAmf5o7tzb0Nq9K9eS3m2HXX7nSrBZokwg");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const { image, segmented, patientId, reportId } = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [highest, setHighest] = useState();
    const [recommendations, setRecommendations] = useState();
    console.log(route.params);

    const GOOGLE_API_KEY = 'AIzaSyAmf5o7tzb0Nq9K9eS3m2HXX7nSrBZokwg'; // Replace with your 
    const apiKey = `${GOOGLE_API_KEY}`; // Replace with your actual API key
    

    async function streamGeminiContent(prompt, content) {
       console.log(prompt + content);

        const result = await model.generateContent(prompt + " " + content );
        const response = await result.response;
        const text = await response.text();
        console.log(text)
        setRecommendations(text);

        
    }
    function generateRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex number
        return '#' + randomColor.padStart(6, '0'); // Pad with leading zeros if necessary
    }
    

    function mergeAndSortData(samplePieData, additionalData) {
        const convertedData = additionalData.map(item => {
            const label = Object.keys(item)[0];
            const value = item[label];
            console.log(value);
            return {
                
                value: parseFloat(value.toFixed(2)),
                label: label,
                color: generateRandomColor(),
                gradientCenterColor: generateRandomColor()
            };
        });

        const combinedData = [...samplePieData, ...convertedData];
        combinedData.sort((a, b) => b.value - a.value);
        combinedData[0].focused = true; // Focus on the highest value
        setHighest(combinedData[0].label);
        console.log(highest)
        return combinedData;
    }

    useEffect(() => {
        const classify = async () => {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', {
                uri: route.params.image,
                name: 'photo.jpg',
                type: 'image/jpeg'
            });

            try {
                let response = await fetch('https://kitten-tight-optionally.ngrok-free.app/classify', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'responseType': 'json',
                    },
                });

                if (!response.ok) throw new Error('Network response was not ok.' + response);
                console.log(response)
                let content = await response.json();
                
                setData(mergeAndSortData([], content));
            } catch (error) {
                console.error('There was an error!', error.message);
                // Simulated fallback data in case of an error
                setData(mergeAndSortData([], [{ 'acne': 12.918820977210999 }, { 'dermatomyositis': 82.23594522476196 }, { 'pediculosis lids': 5.845235288143158 }]));
            } finally {
                setLoading(false);
            }
        };

        classify();
    }, [route.params.image]);

    return (
        <ScrollView style={styles.container}>
            <GeneralHeader title="Classification" />
            {loading ? (
                <View style={styles.splashScreen}>
                    <LottieView
                        style={{ width: 200, height: 200 }}

                        source={require('../../../assets/loadingAnim.json')} // Ensure the path to your Lottie file is correct
                        autoPlay
                        loop={true}

                    />
                    <Text style={styles.loadingText}>Analyzing Image...</Text>
                </View>
            ) : (
                <PieComponent pieData={data} />
            )}

            <TouchableOpacity onPress={async () => await streamGeminiContent("Suggest medications, treatments, lifestyle modifications for a patient who has", highest)}><Text>Generate Recommendations</Text></TouchableOpacity>
            <Text>{recommendations}</Text>
            
            <Button mode="contained" onPress={() => navigation.navigate('Feedback', { patientId: patientId, reportId: reportId, image: image, segmented: segmented, recommendation: recommendations })}>
                Feedback</Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    splashScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
    },
});
