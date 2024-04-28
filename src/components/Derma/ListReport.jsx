import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet,Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import GeneralHeader from '../GeneralHeader';

import FeedbackModal from '../FeedbackModal';
import ViewDetailsModal from '../ViewDetailsModal';

const ListReport = () => {
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

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
        <ScrollView style={styles.scrollView}>
          {reports.map(report => (
            <Card key={report.id} style={styles.card}>
              <Card.Title title={report.title} />
              <Card.Content>
                <Text style={styles.descriptionText}>{report.description}</Text>
                <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                  Status: {report.status}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#007BFF' }]}
                  onPress={() => handleFeedback(report.title)}
                >
                  <Button textColor="#FFFFFF">Feedback</Button>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#1e211f' }]}
                  onPress={() => handleViewDetails(report.title)}
                >
                  <Button textColor="#FFFFFF">View Details</Button>
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
    backgroundColor: '#FFFFFF', // White card background
    elevation: 4,
    borderRadius: 8,
    borderColor: 'lightblue',
    borderWidth: 1,
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
