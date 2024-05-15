import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const { width } = Dimensions.get('window');
const qrSize = width * 1;

const Screen2 = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false); // State to control camera visibility

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        // Reset isCameraOpen state whenever the component re-renders
        setIsCameraOpen(false);
    }, [navigation]); // Triggered when navigation state changes

    const handleBarcodeScanned = ({ data }) => {
        setScanned(true);
        // Handle scanned data here
        console.log('Scanned data:', data);
    };

    const openCamera = () => {
        setIsCameraOpen(true); // Open the camera when button is clicked
    };

    const closeCamera = () => {
        setIsCameraOpen(false); // Close the camera when button is clicked
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
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Anunturi')}
            >
                <Text style={styles.buttonText}>Anunturi</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Users')}
            >
                <Text style={styles.buttonText}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cameraButton}
                onPress={isCameraOpen ? closeCamera : openCamera} // Toggle camera state
            >
                <Text style={styles.buttonText}>{isCameraOpen ? 'Close Camera' : 'Open Camera'}</Text>
            </TouchableOpacity>
            {scanned && (
                <Text style={styles.scanResultText}>QR Code scanned successfully!</Text>
            )}
            {isCameraOpen && ( // Render camera only when isCameraOpen is true
                <View style={styles.cameraContainer}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
                        style={styles.camera}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#192841', // Dark blue background color
    },
    button: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: 'lightblue',
        borderRadius: 5,
    },
    cameraButton: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: 'orange', // Change color as needed
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff', // White text color
    },
    scanResultText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    cameraContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Ensure camera view is clipped to its container
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
