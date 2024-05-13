import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { app } from "./firebaseConfig";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null); // Track user authentication state
    const [isLogin, setIsLogin] = useState(true);
    const navigation = useNavigation(); // Use the navigation object

    const auth = getAuth(app);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    const handleAuthentication = async () => {
        try {
            if (user) {
                // If user is already authenticated, log out
                console.log('User logged out successfully!');
                await signOut(auth);
            } else {
                // Sign in or sign up
                if (isLogin) {
                    // Sign in
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log('User signed in successfully!');
                    navigation.navigate('Screen2'); // Navigate to Screen2 after sign-in
                } else {
                    // Sign up
                    await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User created successfully!');
                    navigation.navigate('Screen2'); // Navigate to Screen2 after sign-up
                }
            }
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user? (
                // Show user's email if user is authenticated
                <View style={styles.authContainer}>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                    <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
                </View>
            ) : (
                // Show sign-in or sign-up form if user is not authenticated
                <View style={styles.authContainer}>
                    <Text style={styles.title}>{isLogin? 'Sign In' : 'Sign Up'}</Text>

                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                    />
                    <View style={styles.buttonContainer}>
                        <Button title={isLogin? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
                    </View>

                    <View style={styles.bottomContainer}>
                        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
                            {isLogin? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'black',
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        backgroundColor: '#192841', // Dark blue background color
        padding: 16,
        borderRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#fff', // White text color
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
        color: '#fff', // White text color
    },
    buttonContainer: {
        marginBottom: 16,
    },
    toggleText: {

        textAlign: 'center',
        color: '#fff', // White text color
    },
    bottomContainer: {
        marginTop: 20,
    },
    emailText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: 'white', // White text color
    },
});


export default LoginScreen;
