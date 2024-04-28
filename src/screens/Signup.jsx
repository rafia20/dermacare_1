import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import tw from 'twrnc';


const Signup = () => {
const navigation = useNavigation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
   
  };

  return (
    <SafeAreaView style={tw`flex-1 `}>
      <Text className='text-xl text-center font-bold py-2 bg-blue-600 w-full px-2 text-white'>Signup</Text>
      <ScrollView contentContainerStyle={tw`p-4 justify-center items-center flex-grow bg-white`}>
        
        <Image
          source={require('../../assets/login.png')}
          style={tw`w-[250px] h-[250px]`} // Adjust size as needed
        />


        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={tw`bg-white w-full mb-4 p-3 rounded-lg border border-gray-300`}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          style={tw`bg-white w-full mb-4 p-3 rounded-lg border border-gray-300`}
        />

     

        <TouchableOpacity
          onPress={handleSignup}
          style={tw`bg-blue-600 w-full p-3 rounded-lg`}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('Login')}}>
          <Text style={tw`text-blue-600 mb-8 text-right py-4`}>Already have account ? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
