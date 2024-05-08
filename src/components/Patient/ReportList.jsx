import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Text, StyleSheet, Image, Button } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { auth, db } from '../../Connection/DB'; // Ensure db is properly imported
import { get, ref } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeneralHeader from '../GeneralHeader';


// Reusable Report Card Component
const ReportCard = ({ report, uid }) => {
    const navigation = useNavigation();
    // AsyncStorage.setItem("role", "patient")
    return (
        <Card style={styles.card}>

            <Card.Title title={report.id} subtitle={`Status: ${report.status}`} />
            <View style={styles.content}>
                {report.image && (
                    <Image
                        source={{ uri: report.image }}
                        style={styles.image}
                    />
                )}
                <View style={styles.details}>
                    {/* <Paragraph>{report.description}</Paragraph> */}
                    <Card.Actions style={styles.actions}>
                        <Button style={{ "borderRadius": 25 }} title="View Details" mode="contained" onPress={() => console.log('View Details')}>View Details</Button>
                        <Button style={{ "borderRadius": 25 }} title="Download PDF" mode="contained" onPress={() => console.log('Download PDF')}>Download PDF</Button>
                        <Button style={{ "borderRadius": 25 }} title="Chat" mode="contained" onPress={() => navigation.navigate('Chat', { reportId: report.id, patientId: uid })}>Chat</Button>
                    </Card.Actions>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 8,
        overflow: 'hidden', // Ensures the content does not overflow the card boundaries
    },
    content: {
        flexDirection: 'row', // Aligns children (image and details) in a row
        padding: 8,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 8,
        borderRadius: 50, // Makes the image circular
    },
    details: {
        flex: 1, // Takes up remaining space
        justifyContent: 'center', // Vertically centers the content inside
    },
    actions: {
        marginTop: 8, // Adds space above the action buttons
        gap: 8, // Adds space between the action buttons
        borderRadius: 25,

    }
});

// Main Component that uses the Report Card
const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [uid, setUid] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUid(user.uid);
            } else {
                // Set a default user ID or handle user not found scenario
                setUid("perpHAw783g5Oc6AgVxxeSaY4F03");
            }
        });

        return () => unsubscribe(); // Clean up the subscription
    }, []);

    useEffect(() => {
        if (uid) {
            loadReports(); // Load reports when UID is set or changed
        }
    }, []); // Dependency array includes uid to reload reports when uid changes

    const loadReports = () => {
        if (!uid) return; // If no UID, exit the function
        setRefreshing(true);
        console.log("Loading reports for user", uid);
        get(ref(db, `patients/${uid}/reports/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const fetchedReports = [];
                snapshot.forEach(childSnapshot => {
                    fetchedReports.push({ id: childSnapshot.key, ...childSnapshot.val() });
                });
                console.log(fetchedReports);
                setReports(fetchedReports);
            } else {
                console.log("No data available");
                setReports([]); // Clear reports if none found
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setRefreshing(false);
        });
    };

    const onRefresh = () => {
        loadReports(); // Refresh reports data
    };

    return (
        <>
            {/* <GeneralHeader title="Reports" /> */}
            <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View>
                    {reports.length > 0 ? (
                        reports.map(report => (
                            <ReportCard key={report.id} report={report} uid={uid} />
                        ))
                    ) : (
                        <Text>No reports available.</Text>
                    )}
                </View>
            </ScrollView>
        </>
    );
};

export default ReportList;
