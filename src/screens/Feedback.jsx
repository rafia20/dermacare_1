import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Linking, ScrollView, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import GeneralHeader from '../components/GeneralHeader';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../Connection/DB';
import { update, ref as dbRef } from 'firebase/database';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function Feedback({ route }) {
    const params = route.params;
    const [recommendation, setRecommendation] = useState(params.recommendation || '');
    const [feedback, setFeedback] = useState('');
    const [pdf, setPdf] = useState('');
    const [loading, setLoading] = useState(false);
    const [uri, setUri] = useState();

    const generatePdf = async () => {
        setLoading(true);
        const html = `
        <html>
        <head>
            <style>
                body { font-family: 'Arial', sans-serif; margin: 20px; }
                h1, h2 { color: #333; }
                p { font-size: 16px; color: #666; }
                img { width: 100%; max-width: 300px; height: auto; margin-top: 10px; }
                .section { margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>Feedback Report</h1>
            <div class="section">
                <h2>Original Image</h2>
                <img src="${params.image}">
            </div>
            <div class="section">
                <h2>Segmented Image</h2>
                <img src="${params.segmented}">
            </div>
            <div class="section">
                <h2>Recommendation</h2>
                <p>${recommendation}</p>
            </div>
            <div class="section">
                <h2>Feedback</h2>
                <p>${feedback}</p>
            </div>
        </body>
        </html>
        `;
        try {
            const file = await Print.printToFileAsync({ html });

            const blob = await fetch(file.uri).then(response => response.blob());

            const path = `reports/${params.patientId}/${params.reportId}/feedback.pdf`;
            await uploadBytes(ref(storage, path), blob);
            const url = await getDownloadURL(ref(storage, path));
            setPdf(url);
            await update(dbRef(db, `patients/${params.patientId}/reports/${params.reportId}`), {
                recommendation, feedback, pdf: url, status: 'approved', segmented: params.segmented
            });
            setUri(file.uri);
        } catch (error) {
            console.error('Error during PDF generation or upload:', error);
        } finally {
            setLoading(false);

        }
    };

    const sharePdf = async () => {
        if (uri) {
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <GeneralHeader title="Feedback" />
                <ScrollView style={styles.scroll}>
                    <Card style={styles.card}>
                        <Card.Title title="Patient Images" />
                        <Card.Content>
                            <Image source={{ uri: params.image }} style={styles.image} />
                            <Image source={{ uri: params.segmented }} style={styles.image} />
                        </Card.Content>
                    </Card>
                    <TextInput
                        label="Recommendation"
                        value={recommendation}
                        onChangeText={setRecommendation}
                        mode="outlined"
                        style={styles.input}
                    />
                    <TextInput
                        label="Feedback"
                        value={feedback}
                        onChangeText={setFeedback}
                        mode="outlined"
                        style={styles.input}
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <>
                            {pdf && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>


                                    <Button icon={'share'} mode="elevated" onPress={async () => { await sharePdf() }} style={styles.button}>
                                        Share PDF
                                    </Button>

                                    <Button icon={'download'} mode="elevated" onPress={() => Linking.openURL(pdf)} style={styles.button}>
                                        Download PDF
                                    </Button>




                                </View>
                            )}
                            <Button mode="contained" onPress={generatePdf} style={styles.button}>
                                Generate PDF
                            </Button>

                        </>
                    )}
                </ScrollView>

            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
    },
    scroll: {
        marginVertical: 4,
    },
    card: {
        margin: 4,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    input: {
        marginVertical: 6,
    },
    button: {
        marginVertical: 10,
    },
    link: {
        color: 'blue',
        fontWeight: 'bold',
    },
});
