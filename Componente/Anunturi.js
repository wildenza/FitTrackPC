import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import app from './firebaseConfig'; // Assuming your firebaseConfig is located in the parent directory
const backgroundImage = require('../assets/gradient.jpeg');

const Anunturi = () => {
    const [anunturi, setAnunturi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedAnunt, setExpandedAnunt] = useState(null);

    useEffect(() => {
        const database = getDatabase(app);
        const anunturiRef = ref(database, 'Anunt');

        onValue(anunturiRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const anunturiList = Object.entries(data).map(([key, value]) => ({id: key, ...value}));
                setAnunturi(anunturiList);
                setLoading(false);
            } else {
                setAnunturi([]);
                setLoading(false);
            }
        });

        return () => {
            // Clean up the listener to prevent memory leaks
            off(anunturiRef);
        };
    }, []);

    const toggleAnuntDetails = (index) => {
        if (expandedAnunt === index) {
            // If the clicked "Anunt" is already expanded, collapse it
            setExpandedAnunt(null);
        } else {
            // Otherwise, expand the clicked "Anunt"
            setExpandedAnunt(index);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <Text style={styles.title}></Text>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <View>
                        {anunturi.map((anunt, index) => (
                            <View key={index} style={styles.anuntContainer}>
                                <Text style={styles.anuntTitle}>Anunt {index + 1}</Text>
                                <Text style={styles.anuntDetalii}>{anunt.Detalii.More}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
        </ImageBackground>
    );
};
const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // White text color
    },
    anuntContainer: {
        width: '100%',
        marginBottom: 20, // Increase margin to make boxes bigger
        padding: 20, // Increase padding to make boxes bigger
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10, // Increase border radius for rounded corners
        minHeight: 100, // Adjust the height as needed
        overflow: 'hidden', // Hide overflow content if any
    },
    anuntTitle: {
        fontWeight: 'bold',
        marginBottom: 10, // Increase margin to separate title from details
        color: '#fff', // White text color
    },
    anuntDetalii: {
        color: 'white',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default Anunturi;
