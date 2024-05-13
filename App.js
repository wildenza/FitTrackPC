import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

// Import your existing screens
import Screen1 from './Componente/Screen1';
import Screen2 from './Componente/Screen2';
import Screen3 from './Componente/Screen3';
import DummyPG from './Componente/DummyPG';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator
const BottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Screen1') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Screen2') {
                    iconName = focused ? 'logo-react' : 'logo-react';
                } else if (route.name === 'Screen3') {
                    iconName = focused ? 'settings' : 'settings-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
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
        <Tab.Screen name="Screen3" component={Screen3} />
    </Tab.Navigator>
);

// Drawer Navigator
const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={BottomTabNavigator} />
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
