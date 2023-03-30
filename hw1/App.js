import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
//import Constants from 'expo-constants';

// You can import from local files
import AssetExample from './components/AssetExample';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import NearMeScreen from './screens/NearMeScreen'
import Friend from './screens/Friend'
import PlanNearMe from './screens/PlanNearMe.js'
import Request from './screens/Request'


const Stack = createNativeStackNavigator();
//options={{ headerShown: false }}
// or any pure javascript modules available in npm
//import { Card } from 'react-native-paper';

export default function App() {
  return (
   <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NearMe" component={NearMeScreen} />
      <Stack.Screen name="Friend" component={Friend} />
      <Stack.Screen name="PlanNearMe" component={PlanNearMe} />
      <Stack.Screen name="Request" component={Request} />

        
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
