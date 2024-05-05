import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Modal, Portal, Provider, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GeneralHeader from '../components/GeneralHeader';
import LinesChart from '../components/LinesChart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationData = ({ route }) => {
  const { latitude, longitude } = route.params.location;
  const [uvData, setUVData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [lineData, setLineData] = useState([])
  const [loading, setLoading] = useState(true);
  function formatVeryCompactDateTime(timestamp) {
    // Create a Date object from the timestamp
    var date = new Date(timestamp);

    // Round the hour to the nearest
    var minutes = date.getMinutes();
    if (minutes >= 30) {
      date.setHours(date.getHours() + 1); // Increment hour if minutes are 30 or more
    }

    // Zero out the minutes and seconds for clean hour display
    date.setMinutes(0, 0, 0);

    // Define options for displaying the day and rounded hour
    var options = {
      month: 'short', // abbreviated month name
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // use 24-hour format
    };

    // Format the date with the specified options
    var compactDateTime = date.toLocaleString('en-US', options);
    compactDateTime = compactDateTime.replace(',', ''); // Remove comma after day
    compactDateTime = compactDateTime.replace(' ', '_'); // Remove extra space after day
    console.log(compactDateTime)

    return compactDateTime;
  }


  function formatTimestamp(timestamp) {
    // Create a Date object from the timestamp
    var date = new Date(timestamp);

    // Get minutes to determine if rounding up or down
    var minutes = date.getMinutes();

    // Round the hour
    if (minutes >= 30) {
      date.setHours(date.getHours() + 1); // Increment hour if minutes are 30 or more
    }

    // Zero out the minutes and seconds for clean rounding
    date.setMinutes(0, 0, 0);

    // Define options for displaying the date
    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    // Format the date with the specified options
    var readableDate = date.toLocaleString('en-US', options);

    return readableDate;
  }

  useEffect(() => {
    const fetchUVData = async () => {
      setLoading(true);
      const data = await AsyncStorage.getItem('uvData');
      if (data) {
        setUVData(JSON.parse(data));
        const dat = []
        for (let i = 0; i < uvData.length; i++) {
          const value = uvData[i].uv;
          const dataPointText = formatVeryCompactDateTime(uvData[i].uv_time);

          dat.push({ value, dataPointText })

        }
        setLineData(dat)
      }
      else {

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
          const dat = []
          for (let i = 0; i < uvData.length; i++) {
            const value = uvData[i].uv;
            const dataPointText = formatVeryCompactDateTime(uvData[i].uv_time);

            dat.push({ value, dataPointText })

          }
          setLineData(dat)
          await AsyncStorage.setItem('uvData', JSON.stringify(result.result));
        } catch (error) {
          console.error('Error fetching UV data:', error);
        }

      }
      setLoading(false);
    }



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

      {loading ? <ActivityIndicator size="large" color="#0000ff" />: 
      
      uvData ? <LinesChart data={uvData} /> : <Text> 'loading...' </Text>}
      {!loading? uvData.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => showModal(getPrecautionaryAdvice(item.uv))}>
          <Card style={[styles.card, { backgroundColor: getAlertColor(item.uv) }]}>
            <Card.Content>
              <Title>UV Level: {item.uv.toFixed(2)}</Title>
              <View style={styles.iconAndText}>
                <MaterialCommunityIcons name={getUVIcon(item.uv)} size={30} color="#517fa4" />
                <Paragraph style={styles.paragraph}>Time: {formatTimestamp(item.uv_time)}</Paragraph>
              </View>
              <Paragraph>Sun Altitude: {item.sun_position.altitude.toFixed(2)}°</Paragraph>
              <Paragraph>Sun Azimuth: {item.sun_position.azimuth.toFixed(2)}°</Paragraph>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))
      
      : <Text>Loading...</Text>}

        
        {}
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
