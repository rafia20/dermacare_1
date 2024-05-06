import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { auth, db } from '../../Connection/DB';
import { get, ref } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    card: {
        margin: 8,
        borderColor: '#1C2A3A',
        borderWidth: 1,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        padding: 8,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 8,
        borderRadius: 50,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'flex-end',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#1C2A3A',
        borderWidth: 1,
        borderRadius: 4,
        padding: 4,
        marginRight: 4,
    },
    actionText: {
        marginLeft: 4,
        color: '#1C2A3A',
    },
    statusText: {
        fontWeight: 'bold',
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
    },
    pressedActionItem: {
        backgroundColor: '#1C2A3A', // Background color when pressed
        borderColor: '#1C2A3A',
    },
    pressedActionText: {
        color: '#FFFFFF', // Text color when pressed
    }
});

const ReportCard = ({ report }) => {
    const [viewDetailsPressed, setViewDetailsPressed] = useState(false);
    const [downloadPdfPressed, setDownloadPdfPressed] = useState(false);

    const statusStyle = {
        color: report.status === 'approved' ? 'green' : (report.status === 'pending' ? '#DAA520' : 'black'),
    };

    return (
        <Card style={styles.card}>
            <Card.Title title={`ID: ${report.id}`} subtitle={`Status: ${report.status}`} subtitleStyle={[styles.statusText, statusStyle]} />
            <View style={styles.content}>
                {report.image && (
                    <Image
                        source={{ uri: report.image }}
                        style={styles.image}
                    />
                )}
                <View style={styles.details}>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionItem, viewDetailsPressed && styles.pressedActionItem]}
                            onPressIn={() => setViewDetailsPressed(true)}
                            onPressOut={() => setViewDetailsPressed(false)}>
                            <MaterialCommunityIcons name="eye-outline" size={24} color={viewDetailsPressed ? '#FFFFFF' : '#1C2A3A'} />
                            <Text style={[styles.actionText, viewDetailsPressed && styles.pressedActionText]}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionItem, downloadPdfPressed && styles.pressedActionItem]}
                            onPressIn={() => setDownloadPdfPressed(true)}
                            onPressOut={() => setDownloadPdfPressed(false)}>
                            <MaterialCommunityIcons name="file-download-outline" size={24} color={downloadPdfPressed ? '#FFFFFF' : '#1C2A3A'} />
                            <Text style={[styles.actionText, downloadPdfPressed && styles.pressedActionText]}>Download PDF</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Card>
    );
};

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [uid, setUid] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUid(user ? user.uid : "perpHAw783g5Oc6AgVxxeSaY4F03");
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (uid) {
            loadReports();
        }
    }, [uid]);

    const loadReports = () => {
        if (!uid) return;
        setRefreshing(true);
        get(ref(db, `patients/${uid}/reports/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const fetchedReports = [];
                snapshot.forEach(childSnapshot => {
                    fetchedReports.push({ id: childSnapshot.key, ...childSnapshot.val() });
                });
                setReports(fetchedReports);
            } else {
                setReports([]);
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setRefreshing(false);
        });
    };

    const onRefresh = () => {
        loadReports();
    };

    return (
        <ScrollView
            style={{ flex: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={styles.header}>Patient Reports</Text>
            <View>
                {reports.length > 0 ? reports.map(report => (
                    <ReportCard key={report.id} report={report} />
                )) : (
                    <Text>No reports available.</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default ReportList;