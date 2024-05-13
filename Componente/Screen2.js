import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';

const Screen2 = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, []);

    const navigateToAnunturi = () => {
        navigation.navigate('Anunturi');
    };

    const navigateToUsers = () => {
        navigation.navigate('Users');
    };

    const handleBarcodeScanned = ({ data }) => {
        // Handle scanned data here
        console.log('Scanned data:', data);
        setIsCameraOpen(false); // Close the camera after scanning
    };

    const openCamera = () => {
        setIsCameraOpen(true);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={navigateToAnunturi}
                    >
                        <Text style={styles.buttonText}>Anunturi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={navigateToUsers}
                    >
                        <Text style={styles.buttonText}>Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={openCamera}
                    >
                        <Text style={styles.buttonText}>Open Camera</Text>
                    </TouchableOpacity>
                    {isCameraOpen && (
                        <RNCamera
                            style={styles.cameraPreview}
                            onBarCodeRead={handleBarcodeScanned}
                        />
                    )}
                </>
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
    cameraPreview: {
        flex: 1,
        width: '100%',
    },
});

export default Screen2;
