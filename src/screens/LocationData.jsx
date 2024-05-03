import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Modal, Portal, Provider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GeneralHeader from '../components/GeneralHeader';

const LocationData = ({ route }) => {
  const { latitude, longitude } = route.params.location;
  const [uvData, setUVData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const fetchUVData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("x-access-token", "openuv-1xtcbw5rlv2nojwy-io");
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
      };

      try {
          const response = await fetch(`https://api.openuv.io/api/v1/forecast?lat=${latitude}&lng=${longitude}&alt=100`, requestOptions);
          const result = await response.json();
          setUVData(result.result);
      } catch (error) {
          console.error('Error fetching UV data:', error);
      }
    };

    fetchUVData();
  }, [latitude, longitude]);

  const showModal = (content) => {
    setModalContent(content);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const getUVIcon = (uvIndex) => {
    if (uvIndex >= 11) return 'weather-sunny-alert';
    if (uvIndex >= 8) return 'weather-sunny';
    if (uvIndex >= 3) return 'weather-partly-cloudy';
    return 'weather-night';
  };
  const getAlertColor = (uvIndex) => {
    if (uvIndex > 8) {
      return '#ffcccc'; // Red alert for very high UV index
    } else if (uvIndex > 5) {
      return '#fff4cc'; // Yellow alert for moderate to high UV index
    } else {
      return '#ccffcc'; // Green alert for low UV index
    }
  };
  

  const getPrecautionaryAdvice = (uvIndex) => {
    if (uvIndex > 8) {
      return 'UV Index is very high! Wear SPF 30+ sunscreen, cover up with clothing, wear a hat and sunglasses, and seek shade, especially during midday hours.';
    } else if (uvIndex > 5) {
      return 'UV Index is moderate to high. Wear SPF 15+ sunscreen, cover up, and consider wearing a hat and sunglasses if you will be outside.';
    } else {
      return 'UV Index is low. Wear sunglasses on bright days. If you burn easily, cover up and use broad spectrum SPF 30+ sunscreen.';
    }
  };

  return (
    <Provider>
      <GeneralHeader title="UV Data" />
      <ScrollView style={styles.container}>
        {uvData.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => showModal(getPrecautionaryAdvice(item.uv))}>
            <Card style={[styles.card, {backgroundColor: getAlertColor(item.uv)}]}>
              <Card.Content>
                <Title>UV Level: {item.uv.toFixed(2)}</Title>
                <View style={styles.iconAndText}>
                  <MaterialCommunityIcons name={getUVIcon(item.uv)} size={30} color="#517fa4" />
                  <Paragraph style={styles.paragraph}>UV Level: {item.uv.toFixed(2)}</Paragraph>
                </View>
                <Paragraph>Sun Altitude: {item.sun_position.altitude.toFixed(2)}°</Paragraph>
                <Paragraph>Sun Azimuth: {item.sun_position.azimuth.toFixed(2)}°</Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalText}>{modalContent}</Text>
          <Button onPress={hideModal}>Close</Button>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f4f8',
  },
  card: {
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  paragraph: {
    fontSize: 16,
    color: '#517fa4',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  }
});

export default LocationData;
