import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Import your existing screens
import Screen1 from './Componente/Screen1';
import Screen2 from './Componente/Screen2';
import Screen3 from './Componente/Screen3';
import DummyPG from './Componente/DummyPG';
import LoginScreen from "./Componente/LoginScreen";

// Tab Bar Icon component
const TabBarIcon = ({ route, focused, color, size }) => {
    let iconName;

    if (route.name === 'Screen1') {
        iconName = focused? 'home' : 'home-outline';
    } else if (route.name === 'Screen2') {
        iconName = focused? 'logo-react' : 'logo-react';
    } else if (route.name === 'Screen3') {
        iconName = focused? 'settings' : 'settings-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
};

// Stack Navigator for Bottom Tab Navigator
const StackNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={BottomTabNavigator} />
    </Stack.Navigator>
);

// Bottom Tab Navigator
const BottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon route={route} focused={focused} color={color} size={size} />
            ),
        })}
        tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            style: {
                borderTopWidth: 0,
            },
        }}
    >
        <Tab.Screen name="Screen1" component={Screen1} />
        <Tab.Screen name="Screen2" component={Screen2} />
        <Tab.Screen name="Screen3" component={LoginScreen} />
    </Tab.Navigator>
);

// Drawer Navigator
const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={StackNavigator} />
        <Drawer.Screen name="Dummy" component={DummyPG} />
    </Drawer.Navigator>
);

export default function App() {
    return (
        <NavigationContainer>
            <DrawerNavigator />
        </NavigationContainer>
    );
}
