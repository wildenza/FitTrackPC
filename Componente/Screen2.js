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
const backgroundImage = require('../assets/downloadd.png'); // Adjust the path to your background image




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

    const navigateToProfile = (email) => {
        navigation.navigate('./Componente/Profile', { userEmail: email }); // Pass user email as a parameter
    };


    const handleCheckButtonPress = async () => {
        try {
            const auth = getAuth(); // Assuming auth is properly initialized
            const database = getDatabase(app); // Make sure app is initialized as your Firebase app instance
            const uid = auth.currentUser.uid; // Assuming auth.currentUser.uid gives the correct user UID

            // Reference to the user's data in the database
            const userRef = ref(database, `users/${uid}`);

            // Fetch the user's data
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.exists() ? userSnapshot.val() : null;

            if (!userData) {
                console.error('User data not found');
                return;
            }

            // Check if the subscription is valid
            if (!userData.Subscription) {
                alert("Your subscription is expired, you can't check-in!");
                return;
            }

            // Reference to the user's isHeInTheGym status in the database
            const isInGymRef = ref(database, `users/${uid}/isHeInTheGym`);
            // Reference to the PersonsInTheGym count
            const personsInGymRef = ref(database, 'PersonsInTheGym');

            // Fetch the current value of isHeInTheGym
            const isInGym = userData.isHeInTheGym;

            // Create a new Date object
            const now = new Date();

            // Format date components separately
            const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

            // Generate a unique key based on the current timestamp
            const formattedDateTime = `${formattedDate},${formattedTime}`;

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
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.largeSquareButton} onPress={() => navigation.navigate('Anunturi')}>
                    <FontAwesome5 name="info-circle" size={32} color="white" />
                    <Text style={styles.buttonText}>Anunturi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.largeSquareButton} onPress={() => navigation.navigate('Profile')}>
                    <FontAwesome5 name="user" size={32} color="white" />
                    <Text style={styles.buttonText}>Profil</Text>
                </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.largeSquareButton} onPress={() => navigation.navigate('Users')}>
                    <FontAwesome5 name="users" size={32} color="white" />
                    <Text style={styles.buttonText}>Users</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.largeSquareButton} onPress={isCameraOpen ? closeCamera : openCamera}>
                    <FontAwesome5 name="camera" size={32} color="white" />
                    <Text style={styles.buttonText}>{isCameraOpen ? 'Close Camera' : 'Open Camera'}</Text>
                </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.largeSquareButton} onPress={() => navigation.navigate('Abonamente')}>
                            <FontAwesome5 name="newspaper" size={32} color="white" />
                            <Text style={styles.buttonText}>Subscription</Text>
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
                        <TouchableOpacity style={styles.largeSquareButton} onPress={() => navigation.navigate('Checkins')}>
                            <FontAwesome5 name="check" size={32} color="white" />
                            <Text style={styles.buttonText}>History Checkins</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.buttonRound} onPress={handleCheckButtonPress}>
                    <Text style={styles.buttonText}>Check me in!</Text>
                </TouchableOpacity>
                <View style={styles.chartButtonContainer}>
                    <TouchableOpacity style={styles.chartButton} onPress={() => navigation.navigate('Hours')}>
                        <FontAwesome5 name="chart-bar" size={24} color="white" />
                    </TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
    },
    largeSquareButton: {
        backgroundColor: '#0d0063',
        width: 130,
        height: 130,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    scanResultText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: 20,
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
    button: {
        marginBottom: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#0d0063',
        borderRadius: 10,
        width: 200,
        alignItems: 'center',
    },
    buttonRound: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#0d0063',
        borderRadius: 50,
        padding: 15,
    },
    chartButtonContainer: {
        position: 'absolute',
        top: 75,
        right: 15,
    },
    chartButton: {
        backgroundColor: '#0d0063',
        borderRadius: 50,
        padding: 10,
        /*bottom:43,
        left:50,*/
    },
});

export default Screen2;
