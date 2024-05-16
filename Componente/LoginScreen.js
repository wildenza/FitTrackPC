import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, set, get, child, push } from 'firebase/database';
import { app, auth, database } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                fetchUserData(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAuthentication = async () => {
        try {
            if (user) {
                console.log('User logged out successfully!');
                await signOut(auth);
            } else {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log('User signed in successfully!');
                    navigation.navigate('Screen2');
                } else {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User created successfully!');
                    await saveUserData(userCredential.user.uid, email);
                    navigation.navigate('Screen2');
                }
            }
        } catch (error) {
            console.error('Authentication error:', error.message);
        }
    };

    const saveUserData = async (uid, email) => {
        try {
            const userRef = ref(database, 'users/' + uid);
            const emailRef = ref(database, 'usersByEmail/' + encodeEmail(email)); // Encode email to handle special characters

            const userData = {
                email: email,
                isHeInTheGym: false,
                Checks: {"null":"null"},
                Privacy: false,
                Subscription: false,
                Locker: "null"
            };

            // Perform both writes in a single transaction
            await set(userRef, userData);
            await set(emailRef, uid);

            console.log('User data and email-UID mapping saved successfully!');
        } catch (error) {
            console.error('Error saving user data:', error.message);
        }
    };

    // Helper function to encode email for use as a Firebase key
    const encodeEmail = (email) => {
        return email.replace('.', ',');
    };


    const fetchUserData = async (uid) => {
        try {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, `users/${uid}`));
            if (snapshot.exists()) {
                console.log('User data:', snapshot.val());
                // Handle user data as needed
            } else {
                console.log('No user data available');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const updateGymStatus = async (uid, status) => {
        try {
            await set(ref(database, `users/${uid}/isHeInTheGym`), status);
            console.log('Gym status updated successfully!');
        } catch (error) {
            console.error('Error updating gym status:', error.message);
        }
    };

    const addCheckInRecord = async (uid, checkInRecord) => {
        try {
            const checkInsRef = ref(database, `users/${uid}/checkIns`);
            await push(checkInsRef, checkInRecord);
            console.log('Check-in record added successfully!');
        } catch (error) {
            console.error('Error adding check-in record:', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user ? (
                <View style={styles.authContainer}>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                    <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
                </View>
            ) : (
                <View style={styles.authContainer}>
                    <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
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
                        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
                    </View>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
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
        backgroundColor: '#192841',
        padding: 16,
        borderRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
        color: '#fff',
    },
    buttonContainer: {
        marginBottom: 16,
    },
    toggleText: {
        textAlign: 'center',
        color: '#fff',
    },
    bottomContainer: {
        marginTop: 20,
    },
    emailText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: 'white',
    },
});

export default LoginScreen;