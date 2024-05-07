import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, RefreshControl } from 'react-native';
import { Card, Button, ToggleButton } from 'react-native-paper';
import GeneralHeader from '../GeneralHeader';
import FeedbackModal from '../FeedbackModal';
import ViewDetailsModal from '../ViewDetailsModal';
import { get, ref, set } from 'firebase/database';
import { db } from '../../Connection/DB';  // Make sure you import your database instance correctl
import { Image } from 'react-native';


const ListReport = ({ route, navigation }) => {
  const { uid } = route.params;
  console.log(uid);

  const [refreshing, setRefreshing] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [patientReports, setPatientReports] = useState([]);
  const [patientId, setPatientId] = useState(uid);
  const [statusFilter, setStatusFilter] = useState('approved'); // 'approved' or 'pending'
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    setRefreshing(true); // Start refreshing
    get(ref(db, 'patients')).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(patientId)
        const reports = [];
        const snap = snapshot.val();
        console.log(snap[patientId])
        if (snap[patientId].reports) {
          for (const key in snap[patientId].reports) {
            reports.push({ id: key, ...snap[patientId].reports[key] });
          }
        }
        console.log(reports);
        setPatientReports(reports);
        setFilteredReports(reports.filter(report => report.status === statusFilter));
        // Here you might want to set this data to your component state
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setRefreshing(false); // End refreshing
    });
  };

  const onRefresh = () => {
    console.log("Refreshing...");
    fetchReports(); // Call fetch reports which handles setting refreshing
  };

  const reports = [
    { id: 1, title: 'Report 1', description: 'This is the first report.', status: 'Approved' },
    { id: 2, title: 'Report 2', description: 'This is the second report.', status: 'Rejected' },
    { id: 3, title: 'Report 3', description: 'This is the third report.', status: 'Approved' },
  ];

  const handleFeedback = (reportTitle) => {
    console.log(`Feedback for ${reportTitle}`);
    setFeedbackModalVisible(true);
  };

  const handleViewDetails = (reportTitle) => {
    console.log(`View details for ${reportTitle}`);
    setDetailsModalVisible(true);
  };

  const getStatusColor = (status) => {
    return status === 'Approved' ? '#28A745' : '#DC3545';
  };

  return (
    <>
      <GeneralHeader title={'Reports'} />

      <View style={styles.container}>
        
        <ToggleButton.Row
          style={{marginLeft: 'auto', marginRight: 'auto'}}
          
          onValueChange={value => setStatusFilter(value)}
          value={statusFilter}
        >
          <ToggleButton  onPress={()=>{ setFilteredReports(patientReports.filter(report => report.status === 'approved')) }} icon="check" value="approved">Approved</ToggleButton>
          <ToggleButton onPress={()=>{ setFilteredReports(patientReports.filter(report => report.status != 'approved')) }} icon="close" value="pending">Pending</ToggleButton>
        </ToggleButton.Row>

        <Text>Filter by status:</Text>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >



          {patientReports.length < 1 && <Text>No reports available.</Text>}

          {filteredReports.map(report => (
            <Card key={report.id} style={styles.card}>
              <Card.Title title={report.id} />
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
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#007BFF' }]}
                  onPress={() => navigation.navigate('Segmentation', { reportId: report.id, imageUrl: report.image, patientId: patientId, reportId: report.id })}
                >
                  <Button textColor="#FFFFFF">Process Report</Button>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#1e211f' }]}
                  onPress={() => handleViewDetails(report.title)}
                >
                  <Button textColor="#FFFFFF">View Details</Button>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: 'green' }]}
                  onPress={() => navigation.navigate('Chat', { reportId: report.id, patientId: patientId })}
                >
                  <Button textColor="#FFFFFF">Chat</Button>
                </TouchableOpacity>

              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Feedback Modal */}
      <FeedbackModal visible={feedbackModalVisible} onClose={() => setFeedbackModalVisible(false)} />

      {/* View Details Modal */}
      <ViewDetailsModal visible={detailsModalVisible} onClose={() => setDetailsModalVisible(false)} />

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F9FA', // Light gray background
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
    // backgroundColor: '#FFFFFF', // White card background
    elevation: 4,
    borderRadius: 8,
    // borderColor: 'lightblue',
    // borderWidth: 1,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#495057', // Dark gray description text
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
