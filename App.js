import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Create the navigators
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Import your screens
import Screen1 from './Componente/Screen1';
import Screen2 from './Componente/Screen2';
import Profile from './Componente/Profile';
import Screen3 from './Componente/Screen3';
import DummyPG from './Componente/DummyPG';
import Anunturi from "./Componente/Anunturi";
import Users from "./Componente/Users";
import LoginScreen from "./Componente/LoginScreen";
import Abonamente from "./Componente/Abonamente";

// Custom icon component
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

// Define the BottomTabNavigator
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
        {/*<Tab.Screen
            name="Screen1"
            component={Screen1}
            options={{ headerShown: false }} // Hide header for Screen1
        />*/}
        <Tab.Screen
            name="Screen2"
            component={Screen2}
            options={{ headerShown: false }} // Hide header for Screen2
        />
        <Tab.Screen
            name="Screen3"
            component={LoginScreen}
            options={{ headerShown: false }} // Hide header for Screen3
        />
    </Tab.Navigator>
);

// Define the StackNavigator
const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="Home"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
        />
    </Stack.Navigator>
);

// Define the DrawerNavigator
const DrawerNavigator = () => (
    <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Panel" component={StackNavigator} />
        {/*<Drawer.Screen name="Dummy" component={DummyPG} />*/}
        <Drawer.Screen name="Anunturi" component={Anunturi} />
        <Drawer.Screen name="Users" component={Users} />
        <Drawer.Screen name="Abonamente" component={Abonamente} />
    </Drawer.Navigator>
);

// Main App component
export default function App() {
    return (
        <NavigationContainer>
            <DrawerNavigator />
        </NavigationContainer>
    );
}
