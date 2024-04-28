import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Title, Card, Paragraph } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure this is correctly imported
import GeneralHeader from '../components/GeneralHeader';

const LocationData = () => {
  const weatherData = {
    temperature: 25, // Current temperature in Celsius
    description: 'Clear', // Weather description
    uvIndex: 7, // UV index
    isDaytime: true, // Day or night status
  };

  const getWeatherIcon = () => {
    return weatherData.isDaytime ? 'weather-sunny' : 'weather-night';
  };

  return (
    <View style={styles.container}>
      <GeneralHeader title={'Location Data'} />

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons
            name={getWeatherIcon()}
            size={100}
            color={weatherData.isDaytime ? '#FFD700' : '#4B0082'}
          />
          <Title style={styles.temperatureText}>{weatherData.temperature}°C</Title>
          <Paragraph style={styles.descriptionText}>{weatherData.description}</Paragraph>
        </Card.Content>
        <Card.Content style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>UV Index</Text>
            <Text style={styles.infoValue}>{weatherData.uvIndex}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Day/Night</Text>
            <Text style={styles.infoValue}>{weatherData.isDaytime ? 'Day' : 'Night'}</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
   
  },
  card: {
    marginVertical: 20,
    elevation: 5,
    shadowOpacity: 0.2,
    marginHorizontal:16
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007BFF',
    padding:25
  },
  descriptionText: {
    fontSize: 24,
    padding:10,
    color: '#333333',
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
    paddingTop: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 18,
    color: '#555555',
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default LocationData;
