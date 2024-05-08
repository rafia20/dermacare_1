import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import GeneralHeader from '../GeneralHeader';
import FeedbackModal from '../FeedbackModal';
import ViewDetailsModal from '../ViewDetailsModal';
import { get, ref } from 'firebase/database';
import { db } from '../../Connection/DB';
import tw from 'twrnc';

const ListReport = ({ route, navigation }) => {
  const { uid } = route.params;
  console.log(uid);

  const [refreshing, setRefreshing] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [patientReports, setPatientReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('approved'); // Default filter
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReportsByStatus();
  }, [statusFilter, patientReports]);

  const fetchReports = () => {
    setRefreshing(true);
    get(ref(db, `patients/${uid}/reports`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const reports = [];
          snapshot.forEach((childSnapshot) => {
            reports.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
          console.log(reports);
          setPatientReports(reports);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const filterReportsByStatus = () => {
    setFilteredReports(
      patientReports.filter((report) =>
        statusFilter === 'approved'
          ? report.status.toLowerCase() === 'approved'
          : report.status.toLowerCase() !== 'approved'
      )
    );
  };

  const onRefresh = () => {
    fetchReports();
  };

  const handleFeedback = (reportTitle) => {
    console.log(`Feedback for ${reportTitle}`);
    setFeedbackModalVisible(true);
  };

  const handleViewDetails = (reportTitle) => {
    console.log(`View details for ${reportTitle}`);
    setDetailsModalVisible(true);
  };

  const getStatusColor = (status) => {
    return status.toLowerCase() === 'approved' ? '#28A745' : '#DC3545';
  };

  return (
    <>
      <GeneralHeader title={'Reports'} />

      <View style={styles.container}>
        <View style={tw`flex-row mb-4`}>
        <Button
            style={[
              tw`flex-1 p-0 h-10`,
              statusFilter === 'approved' ? tw`bg-purple-600` : tw`bg-white`
            ]}
            mode="contained"
            onPress={() => setStatusFilter('approved')}
          >
            <Text style={tw`text-center font-semibold ${statusFilter === 'approved' ? 'text-white' : 'text-black'}`}>
              Approved
            </Text>
          </Button>
          <Button
            style={[
              tw`flex-1 p-0 h-10`,
              statusFilter === 'pending' ? tw`bg-purple-600` : tw`bg-white`
            ]}
            mode="contained"
            onPress={() => setStatusFilter('pending')}
          >
            <Text style={tw`text-center font-semibold ${statusFilter === 'pending' ? 'text-white' : 'text-black'}`}>
              Pending
            </Text>
          </Button>
        </View>

        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredReports.length < 1 && <Text>No reports available.</Text>}

          {filteredReports.map((report) => (
            <Card key={report.id} style={styles.card}>
              <Card.Title title={`Report ${report.id}`} />
              <Card.Content>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={{ uri: report.image }} style={{ width: 50, height: 50, marginRight: 10 }} />
                  <View>
                    <Text style={styles.descriptionText}>{report.description}</Text>
                    <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                      Status: {report.status}
                    </Text>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions style={styles.actions}>
              
                  <Button mode='contained'
                    onPress={() => navigation.navigate('Segmentation', { reportId: report.id, imageUrl: report.image, patientId: uid })}
                  textColor="#FFFFFF">Process Report</Button>
               
                
                  <Button   onPress={() => handleViewDetails(report.id)} textColor="#FFFFFF">View Details</Button>
                
                
                  <Button
                   onPress={() => navigation.navigate('Chat', { reportId: report.id, patientId: uid })}
                  textColor="#FFFFFF">Chat</Button>
                
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
      </View>

      <FeedbackModal visible={feedbackModalVisible} onClose={() => setFeedbackModalVisible(false)} />
      <ViewDetailsModal visible={detailsModalVisible} onClose={() => setDetailsModalVisible(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
    elevation: 4,
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#495057',
  },
  statusText: {
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListReport;
