import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';


const PatientReportCard = ({ patient, onViewReport, onUpdateStatus }) => {
const navigation = useNavigation()
console.log(patient)
  return (
    <View className="m-4 p-4 rounded-lg bg-white shadow">
      <View className="flex-row items-center">
        <Image 
          source={{ uri: patient.imageUrl }}
          className="w-12 h-12 rounded-full mr-4"
          resizeMode="cover"
        />
        <View>
          <Text className="text-lg font-bold text-gray-800">{patient.name}</Text>
          <Text className="text-sm text-gray-600">{patient.age} years old</Text>
        </View>
      </View>
      <View className="mt-3">
        <Text className="text-sm text-gray-800">Summary:</Text>
        <Text className="text-sm text-gray-500">{patient.summary}</Text>
      </View>
      <View className="mt-2 p-2 bg-green-100 rounded">
        <Text className="text-green-800 text-sm font-semibold">Patient ID: {patient.id}</Text>
      </View>
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className="bg-blue-500 py-2 px-4 rounded"
          onPress={onViewReport}>
          <Text onPress={() => navigation.navigate('listreport', { uid: patient.id })} className="text-white text-center font-semibold">View Report</Text>
        </TouchableOpacity>
    
      </View>
    </View>
  );
};

export default PatientReportCard;
