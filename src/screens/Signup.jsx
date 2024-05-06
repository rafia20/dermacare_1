import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, Alert, Animated } from 'react-native';
import tw from 'twrnc';
import { auth } from '../Connection/DB';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade-in animation effect
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Handle user signup
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Display congratulations alert
        Alert.alert(
          
          "Congratulations!",
          "Your account has been successfully created. Welcome to DermCare!",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('AddProfile') // Navigate to the next page after the alert
            }
          ]
        );
      })
      .catch(error => {
        // Handle different error codes and provide appropriate feedback
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert("Email in Use", "That email address is already in use.");
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert("Invalid Email", "That email address is invalid.");
        } else {
          console.error(error);
          Alert.alert("Signup Error", "Something went wrong during signup. Please try again.");
        }
      });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Logo and Title */}
      <View style={tw`flex-row justify-start p-4`}>
        <Image source={require('../../assets/Vector.png')} style={tw`w-10 h-10 mr-2`} />
        <Text style={tw`text-[#1C2A3A] text-2xl font-bold`}>DermCare</Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-4 justify-center items-center flex-grow`}>
        {/* Animated Welcome Message */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
            },
            tw`mb-8 bg-blue-100 p-4 rounded-lg shadow-lg`,
          ]}
        >
          <Text style={tw`text-xl text-center text-[#1C2A3A] font-bold`}>
            Welcome to DermCare!
          </Text>
          <Text style={tw`text-lg text-center text-gray-600`}>
            Sign up now and receive excellent dermatological care.
          </Text>
        </Animated.View>

        {/* Center Image */}
        <Image
          source={require('../../assets/login.png')} // Adjust image path as needed
          style={tw`w-[250px] h-[200px] mb-8`} // Adjust size as required
        />

        {/* Signup Form */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={tw`bg-white w-full mb-4 p-3 rounded-lg border border-gray-400 shadow-sm`}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          style={tw`bg-white w-full mb-4 p-3 rounded-lg border border-gray-400 shadow-sm`}
        />
        <TouchableOpacity
          onPress={handleSignup}
          style={tw`bg-[#1C2A3A] w-full p-3 rounded-lg shadow-md`}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>Signup</Text>
        </TouchableOpacity>

        {/* Additional Information */}
        <Text style={tw`text-gray-600 text-center mt-8`}>Sign up as a patient to receive personalized treatment.</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={tw`text-[#1C2A3A] text-right py-4`}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;