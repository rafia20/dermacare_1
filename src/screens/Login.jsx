import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import tw from 'twrnc';
import { auth } from '../Connection/DB';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AntDesign } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
  const [isDermaLogin, setIsDermaLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mtn, setMtn] = useState('');

  const navigation = useNavigation()

  const handleLogin = () => {
    if (isDermaLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          AsyncStorage.setItem('userType', 'derma');
          AsyncStorage.setItem('email', email);
          AsyncStorage.setItem("uid", auth.currentUser.uid);
          console.log('User signed in!');
          navigation.navigate('Derma')
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
          else if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
          else if (error.code === 'auth/user-not-found') {
            console.log('User not found');
          }
          else if (error.code === 'auth/wrong-password') {
            console.log('Wrong password');
          }
          else {
            console.error(error);
          }
        });


    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {

          console.log('Patient login');
          AsyncStorage.setItem('userType', 'patient');
          AsyncStorage.setItem('email', email);
          AsyncStorage.setItem("uid", auth.currentUser.uid);
          navigation.navigate('Patient');
        });
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 `}>
      <Text className='text-xl text-center font-bold py-2 bg-blue-600 w-full px-2 text-white'>Login</Text>
      <ScrollView contentContainerStyle={tw`p-4 justify-center items-center flex-grow bg-white`}>

        <Image
          source={require('../../assets/login.png')}
          style={tw`w-[250px] h-[250px]`} // Adjust size as needed
        />


        {/* Toggle Button */}
        <View style={tw`flex-row mb-4`}>
          <TouchableOpacity
            style={tw`flex-1 ${isDermaLogin ? 'bg-blue-600' : 'bg-white'} p-2 rounded-l-lg`}
            onPress={() => setIsDermaLogin(true)}
          >
            <Text style={tw`${isDermaLogin ? 'text-white' : 'text-blue-600'} text-center font-semibold`}>
              Login as Derma
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 ${isDermaLogin ? 'bg-white' : 'bg-blue-600'} p-2 rounded-r-lg`}
            onPress={() => setIsDermaLogin(false)}
          >
            <Text style={tw`${isDermaLogin ? 'text-blue-600' : 'text-white'} text-center font-semibold`}>
              Login as Patient
            </Text>
          </TouchableOpacity>
        </View>

        {/* ... rest of your login form */}

        {isDermaLogin && (
          <View style={{ width: '100%', marginBottom: 20 }}>
            <TextInput
              value={mtn}
              onChangeText={setMtn}
              placeholder="MTN"
              keyboardType="email-address"
              autoCapitalize="none"
              style={tw`bg-white w-full pl-3 pr-10 py-3 rounded-lg border border-gray-300`}
            />
            <AntDesign
              name={mtn === "derm123" || mtn === "DERM123" ? "checkcircle" : "closecircle"}
              size={24}
              color={mtn === "derm123" || mtn === "DERM123" ? "green" : "red"}
              style={tw`absolute right-3 top-3`}  // Position the icon inside the TextInput
            />
          </View>
        )}

        {(mtn === "derm123" || mtn === "DERM123") || (!isDermaLogin) && (
          <>
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
          </>
        )}

        <TouchableOpacity className='self-end' onPress={() => { }}>
          <Text style={tw`text-blue-600 mb-8 text-right`}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          style={tw`bg-blue-600 w-full p-3 rounded-lg`}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Signup') }}>
          <Text style={tw`text-blue-600 mb-8 text-right py-4`}>Dont have account ? Signup</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
