import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, push, set, update, get, runTransaction } from 'firebase/database';
import { app, database, auth } from './firebaseConfig'; // Assuming your firebaseConfig is located in the parent directory
import { FontAwesome5 } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
const qrSize = width * 1;
const backgroundImage = require('../assets/download.jpeg'); // Adjust the path to your background image

const Screen2 = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        // Reset isCameraOpen state whenever the component re-renders
        setIsCameraOpen(false);
    }, [navigation]);

    const handleBarcodeScanned = ({ data }) => {
        setScanned(true);
        console.log('Scanned data:', data);
    };

    const openCamera = () => {
        setIsCameraOpen(true);
    };

    const closeCamera = () => {
        setIsCameraOpen(false);
    };

    const handleCheckButtonPress = async () => {
        try {
            const auth = getAuth(); // Assuming auth is properly initialized
            const database = getDatabase(app); // Make sure app is initialized as your Firebase app instance
            const uid = auth.currentUser.uid; // Assuming auth.currentUser.uid gives the correct user UID

            // Reference to the user's isHeInTheGym status in the database
            const isInGymRef = ref(database, `users/${uid}/isHeInTheGym`);
            // Reference to the PersonsInTheGym count
            const personsInGymRef = ref(database, 'PersonsInTheGym');

            // Fetch the current value of isHeInTheGym
            const snapshot = await get(isInGymRef);
            const isInGym = snapshot.exists() ? snapshot.val() : false;

            // Generate a unique key based on the current timestamp
            const now = new Date();
            let formattedDateTime = now.toLocaleString().replace(/\/|\s/g, ":");
            formattedDateTime = formattedDateTime.replace(/[."]/g, "_");

            // Create a reference to the Checks node under the user's document
            const checksRef = ref(database, `users/${uid}/Checks/${formattedDateTime}`);

            // Create check-in or check-out record based on current status
            const checkRecord = isInGym ? { 'Check-out': formattedDateTime } : { 'Check-in': formattedDateTime };

            // Run a transaction to update PersonsInTheGym count and user's isHeInTheGym status atomically
            await runTransaction(personsInGymRef, (currentCount) => {
                if (currentCount === null) {
                    currentCount = 0;
                }
                if (isInGym) {
                    // Decrement count if checking out
                    return currentCount - 1;
                } else {
                    // Increment count if checking in
                    return currentCount + 1;
                }
            });

            // Add the check-in/out record with the unique key
            await set(checksRef, checkRecord);

            // Update the isHeInTheGym status
            await set(isInGymRef, !isInGym);

            console.log(`Check-${isInGym ? 'out' : 'in'} recorded with key ${formattedDateTime}`);
        } catch (error) {
            console.error('Error recording check-in/out:', error.message);
        }
    };


    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (hasPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Anunturi')}>
                    <Text style={styles.buttonText}>Anunturi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Users')}>
                    <Text style={styles.buttonText}>Users</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={isCameraOpen ? closeCamera : openCamera}>
                    <Text style={styles.buttonText}>{isCameraOpen ? 'Close Camera' : 'Open Camera'}</Text>
                </TouchableOpacity>
                {scanned && <Text style={styles.scanResultText}>QR Code scanned successfully!</Text>}
                {isCameraOpen && (
                    <View style={styles.cameraContainer}>
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
                            style={styles.camera}
                        />
                    </View>
                )}
                <TouchableOpacity style={styles.button} onPress={handleCheckButtonPress}>
                    <Text style={styles.buttonText}>Check</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#0d0063', // Adjusted color to match the HomeScreen buttons
        borderRadius: 10, // Adjusted border radius to match the HomeScreen buttons
        width: 200, // Adjusted width for consistency
        alignItems: 'center', // Center text horizontally
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    scanResultText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    cameraContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        width: qrSize,
        height: qrSize,
        borderRadius: 10,
    },
    camera: {
        width: '100%',
        height: '100%',
    },
});

export default Screen2;
