import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import ReportPosting from './Patient/ReportPosting';
import ReportList from './Patient/ReportList';
import Booking from './Derma/Booking';
import Settings from './Derma/Settings';
import Header from './Header';

const Tab = createBottomTabNavigator();

const PatientBottomMenu = () => {
  return (
    <>
      <Header />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AllReports') {
              // Using the prescription icon for this tab
              iconName = focused ? 'prescription' : 'prescription';
            } else if (route.name === 'Bookings') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'cog' : 'cog-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1C2A3A',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen options={{ headerShown: false }} name="Home" component={ReportPosting} />
        <Tab.Screen options={{ headerShown: false }} name="AllReports" component={ReportList} />
        <Tab.Screen options={{ headerShown: false }} name="Bookings" component={Booking} />
        <Tab.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
      </Tab.Navigator>
    </>
  );
};

export default PatientBottomMenu;