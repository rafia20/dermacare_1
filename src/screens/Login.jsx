
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import tw from 'twrnc';
import { auth } from '../Connection/DB';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const Login = () => {
  const [isDermaLogin, setIsDermaLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mtn, setMtn] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    if (isDermaLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          AsyncStorage.setItem('userType', 'derma');
          AsyncStorage.setItem('email', email);
          AsyncStorage.setItem('uid', auth.currentUser.uid);
          navigation.navigate('Derma');
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          AsyncStorage.setItem('userType', 'patient');
          AsyncStorage.setItem('email', email);
          AsyncStorage.setItem('uid', auth.currentUser.uid);
          navigation.navigate('Patient');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-4 justify-center items-center flex-grow`}>
        {/* Logo and Title */}
        <View style={tw`items-center mb-8`}>
          <Image source={require('../../assets/Vector.png')} style={tw`w-24 h-24 mb-2`} />
          <Text style={tw`text-center text-xl font-bold`}>DermCare</Text>
        </View>

        {/* Login Image */}
        <Image source={require('../../assets/login.png')} style={tw`w-40 h-40 mb-8`} />

        {/* Icon-based Toggle Button */}
        <View style={tw`flex-row mb-4`}>
          <TouchableOpacity
            style={tw`flex-1 ${isDermaLogin ? 'bg-[#1C2A3A]' : 'bg-white'} p-2 rounded-l-lg flex-row items-center justify-center border border-gray-300`}
            onPress={() => setIsDermaLogin(true)}
          >
            <FontAwesome name="user-md" size={20} color={isDermaLogin ? "white" : "#1C2A3A"} style={tw`mr-2`} />
            <Text style={tw`${isDermaLogin ? 'text-white' : 'text-[#1C2A3A]'} text-center font-semibold`}>
              Login as Derm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 ${isDermaLogin ? 'bg-white' : 'bg-[#1C2A3A]'} p-2 rounded-r-lg flex-row items-center justify-center border border-gray-300`}
            onPress={() => setIsDermaLogin(false)}
          >
            <FontAwesome name="user" size={20} color={isDermaLogin ? "#1C2A3A" : "white"} style={tw`mr-2`} />
            <Text style={tw`${isDermaLogin ? 'text-[#1C2A3A]' : 'text-white'} text-center font-semibold`}>
              Login as Patient
            </Text>
          </TouchableOpacity>
        </View>

        {/* MTN Input for Derms */}
        {isDermaLogin && (
          <View style={{ width: '100%', marginBottom: 20 }}>
            <TextInput
              value={mtn}
              onChangeText={setMtn}
              placeholder="MTN"
              keyboardType="default"
              autoCapitalize="none"
              style={tw`bg-white w-full pl-3 pr-10 py-3 rounded-lg border border-gray-300 shadow-sm`}
            />
            <FontAwesome
              name={mtn === "derm123" || mtn === "DERM123" ? "checkcircle" : "closecircle"}
              size={24}
              color={mtn === "derm123" || mtn === "DERM123" ? "green" : "red"}
              style={tw`absolute right-3 top-3`} // Position the icon inside the TextInput
            />
          </View>
        )}

        {/* Email and Password Inputs */}
        {(mtn === "derm123" || mtn === "DERM123") || (!isDermaLogin) && (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={tw`bg-white w-full mb-4 p-3 rounded-lg border border-gray-300 shadow-sm`}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={true}
              autoCapitalize="none"
              style={tw`bg-white w-full mb-4 p-3 rounded-lg border border-gray-300 shadow-sm`}
            />
          </>
        )}

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => { }} style={tw`self-end mb-8`}>
          <Text style={tw`text-[#1C2A3A] text-right`}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={tw`bg-[#1C2A3A] w-full p-3 rounded-lg shadow-md`}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>Login</Text>
        </TouchableOpacity>

        {/* Signup Redirect */}
        <TouchableOpacity onPress={() => { navigation.navigate('Signup') }} style={tw`mt-4`}>
          <Text style={tw`text-[#1C2A3A] text-right`}>Don't have an account? Signup</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;