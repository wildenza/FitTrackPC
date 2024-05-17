import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

// Import Firebase
import { app, database, auth } from './Componente/firebaseConfig';

// Import your screens
import Screen2 from './Componente/Screen2';
import LoginScreen from "./Componente/LoginScreen";
import Anunturi from "./Componente/Anunturi";
import Users from "./Componente/Users";
import Abonamente from "./Componente/Abonamente";
import Profile from "./Componente/Profile";
import Checkins from "./Componente/Checkins";
import Hours from './Componente/Hours';

// Create the navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Define the StackNavigator
const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="Screen2"
            component={Screen2}
            options={{ headerShown: false }} // Hide header for Screen2
        />
    </Stack.Navigator>
);

const DrawerNavigator = () => (
    <Drawer.Navigator
        initialRouteName="Screen2"
        screenOptions={{ headerTransparent: true, headerTitleStyle: { color: 'transparent' } }} // Hide header for all drawer screens
    >
        <Drawer.Screen name="Panel" component={StackNavigator} />
        <Drawer.Screen name="Anunturi" component={Anunturi} />
        <Drawer.Screen name="Users" component={Users} />
        <Drawer.Screen name="Abonamente" component={Abonamente} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Checkins" component={Checkins} />
        <Drawer.Screen name="Hours" component={Hours} />
        {/*<Drawer.Screen name="Paypal" component={Paypal} />*/}
    </Drawer.Navigator>
);


// Main App component
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsLoggedIn(!!user);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <NavigationContainer>
            {isLoggedIn ? <DrawerNavigator /> : <LoginScreen />}
        </NavigationContainer>
    );
}
