import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert, Platform } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState(new Date());
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation();

    const handleAuthentication = async () => {
        // Check if any mandatory field is empty (for sign-up only)
        if (!isLogin && (!email || !password || !firstName || !lastName || !dob || !phone)) {
            Alert.alert('Error', 'All mandatory fields are required for sign-up.');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Invalid email format.');
            return;
        }

        // Password strength validation (minimum 6 characters)
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }

        // Romanian phone number format validation (for sign-up only)
        if (!isLogin) {
            const phoneRegex = /^(?:0|\+?40)(?:[ .-]?[0-9]){9}$/;
            if (!phoneRegex.test(phone)) {
                Alert.alert('Error', 'Invalid Romanian phone number format.');
                return;
            }
        }

        try {
            if (user) {
                console.log('User logged out successfully!');
                await signOut(auth);
                setUser(null);
            } else {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log('User signed in successfully!');
                    // Navigate to Screen2 with user email as parameter
                    navigation.navigate('Screen2');
                } else {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User created successfully!');
                    await saveUserData(userCredential.user.uid, email, firstName, lastName);
                    // Navigate to Screen2 with user email as parameter
                    navigation.navigate('Screen2');
                }
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' ) {
                // Display error for incorrect email or password
                Alert.alert('Error', 'Incorrect email or password.');
            } else if (error.code === 'auth/email-already-in-use') {
                // Display error for existing email during signup
                Alert.alert('Error', 'An account with this email already exists.');
            } else {
                // Display generic authentication error
                Alert.alert('Error', 'Authentication failed. Please try again later.');
            }
            console.error('Authentication error:', error.message);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios');
        setDob(currentDate);
    };
    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const saveUserData = async (uid, email, firstName, lastName) => {
        try {
            const userRef = ref(database, 'users/' + uid);
            const emailRef = ref(database, 'usersByEmail/' + encodeEmail(email));

            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                dob: dob.toISOString(), // Save date of birth as string
                phone: phone,
                location: location || null,
                address: address || null,
                isHeInTheGym: false,
                Checks: {"null":"null"},
                Privacy: false,
                Subscription: false,
                Locker: "null"
            };

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
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dob}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            {user ? (
                <View style={styles.authContainer}>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                    <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
                </View>
            ) : (
                <View style={styles.authContainer}>
                    <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
                    {!isLogin && (
                        <>
                            <Button title="Pick Date of Birth" onPress={showDatepicker} />
                            <TextInput
                                style={styles.input}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                                autoCapitalize="words"
                            />
                            <TextInput
                                style={styles.input}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                                autoCapitalize="words"
                            />
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Romanian Phone Number"
                                keyboardType="phone-pad"
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={styles.input}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="Location (Optional)"
                                autoCapitalize="words"
                            />
                            <TextInput
                                style={styles.input}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Address (Optional)"
                                autoCapitalize="words"
                            />
                        </>
                    )}
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