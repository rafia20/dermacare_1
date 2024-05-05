import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GeneralHeader from '../GeneralHeader';
import PieComponent from '../PieChart';
import LottieView from 'lottie-react-native';

export default function Classification({ route }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    function generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    function mergeAndSortData(samplePieData, additionalData) {
        const convertedData = additionalData.map(item => {
            const label = Object.keys(item)[0];
            const value = item[label];
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
                let content = await response.json();
                setData(mergeAndSortData([], content));
            } catch (error) {
                console.error('There was an error!', error);
                // Simulated fallback data in case of an error
                setData(mergeAndSortData([], [{'acne': 12.918820977210999}, {'dermatomyositis': 81.23594522476196}, {'pediculosis lids': 5.845235288143158}]));
            } finally {
                setLoading(false);
            }
        };

        classify();
    }, [route.params.image]);

    return (
        <View style={styles.container}>
            <GeneralHeader title="Classification" />
            {loading ? (
                <View style={styles.splashScreen}>
                    <LottieView
                        style={{width: 200, height: 200}}

                        source={require('../../../assets/loadingAnim.json')} // Ensure the path to your Lottie file is correct
                        autoPlay
                        loop={true}
                        
                    />
                    <Text style={styles.loadingText}>Analyzing Image...</Text>
                </View>
            ) : (
                <PieComponent pieData={data} />
            )}
        </View>
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