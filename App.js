import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavDerma from './src/components/BottomNavDerma';
import Onboarding from './src/screens/Onboarding';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import ListReport from './src/components/Derma/ListReport';
import LocationData from './src/screens/LocationData';
import AddProfile from './src/screens/AddProfile';
import PatientBottomMenu from './src/components/PatientBottomMenu';
import ReportList from './src/components/Patient/ReportList';
import Home from './src/components/Derma/Home';
import Chat from './src/screens/Chat';
import RAGChat from './src/screens/RAGChat';
// import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';
import Segmentation from './src/components/Derma/Segmentation';
import Classification from './src/components/Derma/Classification';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationTypeForReplace: 'pop',
        }}
      >
        
        
        <Stack.Screen name="Derma" component={BottomNavDerma} />
        <Stack.Screen name='Segmentation' component={Segmentation} />
        <Stack.Screen name='Classify' component={Classification} />
        {/* <Stack.Screen name="Patient" component={PatientBottomMenu} /> */}
        <Stack.Screen name='Chat with AI' component={RAGChat} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Chat' component={Chat} />
        

        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AddProfile" component={AddProfile} />
        <Stack.Screen name="Signup" component={Signup} />
        
        <Stack.Screen name="Onboarding" component={Onboarding} />

        <Stack.Screen name="listreport" component={ListReport} />
        <Stack.Screen name="locationData" component={LocationData} />
        <Stack.Screen name="AllReports" component={ReportList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
