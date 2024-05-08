import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text,  TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import tw from 'twrnc';
import { auth, provider } from '../Connection/DB';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
const navigation = useNavigation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('User account created & signed in!');
        navigation.navigate('AddProfile');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <SafeAreaView style={tw`flex-1 `}>
      {/* <Text className='text-xl text-center font-bold py-2 bg-blue-600 w-full px-2 text-white'>Signup</Text> */}
      <ScrollView contentContainerStyle={tw`p-4 justify-center items-center flex-grow bg-white`}>
        
        <Image
          source={require('../../assets/login.png')}
          style={tw`w-[250px] h-[250px]`} // Adjust size as needed
        />


        <TextInput
        mode='outlined'
        label={'Email'}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={tw`bg-white w-full mb-4 rounded-lg `}
        />

        <TextInput
         mode='outlined'
         label={'Password'}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          style={tw`bg-white w-full mb-4 rounded-lg `}
        />

     

        <Button
          onPress={handleSignup}
          mode='contained'
          style={tw` w-full rounded-lg`}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>Signup</Text>
        </Button>
        <TouchableOpacity onPress={() => {navigation.navigate('Login')}}>
          <Text style={tw`text-blue-600 mb-8 text-right py-4`}>Already have account ? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
