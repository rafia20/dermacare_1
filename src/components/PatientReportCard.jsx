import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const PatientReportCard = ({ patient }) => {
  const navigation = useNavigation();
  console.log(patient);

  return (
    <View style={[styles.card, styles.shadow]}>
      <View style={styles.row}>
        <Image
          source={{ uri: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.1224184972.1715126400&semt=ais" }}
          style={styles.image}
          resizeMode="cover"
        />
        <View>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.age}>{patient.age} years old</Text>
        </View>
      </View>
      <View style={styles.summary}>
        <Text style={styles.label}>Summary:</Text>
        <Text style={styles.summaryText}>{patient.summary}</Text>
      </View>
      <View style={styles.patientIdContainer}>
        <Text style={styles.patientId}>Patient ID: {patient.id}</Text>
      </View>
      <View style={styles.actions}>
        <Button
        icon={'file-document'}
          mode="contained"
          onPress={() => navigation.navigate('listreport', { uid: patient.id })}
        >
          <Text style={styles.buttonText}>View Report</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 4, // Adds elevation for Android
  },
  shadow: {
    // Adds shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  age: {
    fontSize: 14,
    color: '#666',
  },
  summary: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  patientIdContainer: {
    padding: 8,
    backgroundColor: '#E6F4EA',
    borderRadius: 6,
    marginBottom: 16,
  },
  patientId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PatientReportCard;
