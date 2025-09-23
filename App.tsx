import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { BossListScreen } from './src/screens/BossListScreen';
import { BossDetailScreen } from './src/screens/BossDetailScreen';
import { CharactersScreen } from './src/screens/CharactersScreen';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BossesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BossList" component={BossListScreen} options={{ title: 'Bosses' }} />
      <Stack.Screen name="BossDetail" component={BossDetailScreen} options={{ title: 'Boss detail' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Characters" component={CharactersScreen} />
        <Tab.Screen name="Bosses" component={BossesStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
