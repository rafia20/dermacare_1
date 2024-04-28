import React from 'react';
import { View, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; 


const GeneralHeader = ({ title }) => {
  const navigation = useNavigation(); 

  return (
    <Appbar.Header style={{ backgroundColor: 'white' }}> 
      {navigation.canGoBack() && (
        <Appbar.BackAction onPress={() => navigation.goBack()} color="black" />
      )}
      <Appbar.Content
        title={title || 'GeneralHeader'}
        titleStyle={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}
      />
    </Appbar.Header>
  );
};

export default GeneralHeader;
