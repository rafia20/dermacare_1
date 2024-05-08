import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import Home from './Derma/Home';
import Maps from './Derma/Maps';
import VisualSearch from './Derma/VisualSearch';
import Settings from './Derma/Settings';
import Header from './Header';
import ReportPosting from './Patient/ReportPosting';
import ReportList from './Patient/ReportList';
import NewsScreen from '../screens/NewsScreen';
import DiseaseInformationScreen from '../screens/DiseaseInformationScreen';

const Tab = createBottomTabNavigator();

const PatientBottomMenu = () => {
  return (
    <>
    <Header/>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Maps') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline'; // Assuming 'cog' is the icon for settings
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      
        tabBarActiveTintColor: '#4287f5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen options={{ headerShown: false }} name="Home" component={ReportPosting} />
      <Tab.Screen options={{ headerShown: false }} name="AllReports" component={ReportList} />
      <Tab.Screen options={{ headerShown: false }} name="Visual Search" component={VisualSearch} />
      <Tab.Screen options={{ headerShown: false }} name="News" component={NewsScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Search Disease" component={DiseaseInformationScreen} />
      {/* <Tab.Screen options={{ headerShown: false }} name="Bookings" component={Booking} /> */}
      <Tab.Screen options={{ headerShown: false }} name="Maps" component={Maps} />
      <Tab.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
    </Tab.Navigator>
    </>
  );
};

export default PatientBottomMenu;
