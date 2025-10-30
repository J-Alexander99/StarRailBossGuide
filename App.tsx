import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, Image } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/HomeScreen";
import { BossListScreen } from "./src/screens/BossListScreen";
import { BossDetailScreen } from "./src/screens/BossDetailScreen";
import { CharactersScreen } from "./src/screens/CharactersScreen";
import { CharacterDetailScreen } from "./src/screens/CharacterDetailScreen";
import { TeamsScreen } from "./src/screens/TeamsScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { CharacterOwnershipProvider } from "./src/context/CharacterOwnershipContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dark theme for navigation
const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#ff6ce0",
    background: "#130914",
    card: "#191222",
    text: "#f4ecff",
    border: "rgba(255, 255, 255, 0.06)",
    notification: "#ff6ce0",
  },
};

function CharactersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#191222",
          borderBottomColor: "rgba(255, 255, 255, 0.06)",
          borderBottomWidth: 1,
          shadowColor: "#2a1538",
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "700",
          color: "#f4ecff",
        },
        headerTintColor: "#ff6ce0",
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="CharactersList"
        component={CharactersScreen}
        options={{ title: "Trailblazer Roster" }}
      />
      <Stack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={{ title: "Character Details" }}
      />
      <Stack.Screen
        name="Teams"
        component={TeamsScreen}
        options={{ title: "Strike Teams" }}
      />
    </Stack.Navigator>
  );
}

function BossesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#191222",
          borderBottomColor: "rgba(255, 255, 255, 0.06)",
          borderBottomWidth: 1,
          shadowColor: "#2a1538",
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "700",
          color: "#f4ecff",
        },
        headerTintColor: "#ff6ce0",
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="BossList"
        component={BossListScreen}
        options={{ title: "Boss Intel Archive" }}
      />
      <Stack.Screen
        name="BossDetail"
        component={BossDetailScreen}
        options={{ title: "Boss Dossier" }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#191222",
          borderTopColor: "rgba(255, 255, 255, 0.06)",
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: 60 + Math.max(insets.bottom, 0),
        },
        tabBarActiveTintColor: "#ff6ce0",
        tabBarInactiveTintColor: "#9f8ab8",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: "#191222",
          borderBottomColor: "rgba(255, 255, 255, 0.06)",
          borderBottomWidth: 1,
          shadowColor: "#2a1538",
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "700",
          color: "#f4ecff",
        },
        headerTintColor: "#ff6ce0",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Guide Hub",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={require("./images/icons/home.png")}
              style={{
                width: 24,
                height: 24,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Characters"
        component={CharactersStack}
        options={{
          headerShown: false,
          title: "Trailblazer Roster",
          tabBarLabel: "Roster",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={require("./images/icons/roster.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bosses"
        component={BossesStack}
        options={{
          headerShown: false,
          title: "Boss Intel",
          tabBarLabel: "Bosses",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={require("./images/icons/bosses.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings & Roster",
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <Image
              source={require("./images/icons/settings.png")}
              style={{
                width: 24,
                height: 24,
                tintColor: color,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CharacterOwnershipProvider>
        <StatusBar barStyle="light-content" backgroundColor="#130914" />
        <NavigationContainer theme={DarkTheme}>
          <TabNavigator />
        </NavigationContainer>
      </CharacterOwnershipProvider>
    </SafeAreaProvider>
  );
}
