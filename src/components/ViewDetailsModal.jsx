import React from 'react';
import { View, StyleSheet, Text, Modal, Button } from 'react-native';

const ViewDetailsModal = ({ visible, onClose }) => {
  // Dummy report data for testing
  const reportData = {
    patientName: 'John Doe',
    age: '30',
    diseaseType: 'Diabetes',
  };

  const handleDismiss = () => {
    // Close the modal
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Details</Text>
          
          {/* Render patient report data */}
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>{reportData.patientName}</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{reportData.age}</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Disease Type:</Text>
            <Text style={styles.value}>{reportData.diseaseType}</Text>
          </View>
          
          {/* Placeholder for detailed information */}
          <Text style={styles.placeholderText}>Detailed information goes here...</Text>
          
          {/* Close button */}
          <Button title="Close" onPress={handleDismiss} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  patientInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    flex: 1,
  },
  placeholderText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666666',
  },
});

export default ViewDetailsModal;
