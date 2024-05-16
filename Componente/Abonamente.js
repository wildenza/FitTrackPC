import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import app from './firebaseConfig';

const Abonamente = () => {
    const [abonamente, setAbonamente] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const database = getDatabase(app);
        const abonamenteRef = ref(database, 'Abonamente');

        onValue(abonamenteRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const abonamenteList = Object.entries(data).map(([key, value]) => ({ type: key,...value }));
                setAbonamente(abonamenteList);
                setLoading(false);
            } else {
                setAbonamente([]);
                setLoading(false);
            }
        });

        return () => {
            off(abonamenteRef);
        };
    }, []);

    return (
        <ImageBackground source={require('../assets/download.jpeg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Abonamente</Text>
                {loading? (
                    <Text>Loading...</Text>
                ) : (
                    <View>
                        {abonamente.map((abonament, index) => (
                            <View key={index} style={styles.abonamentContainer}>
                                <Text style={styles.abonamentTitle}>{abonament.type}</Text>
                                <Text style={styles.abonamentBenef}>{abonament.Benef}</Text>
                            </View>
                        ))}
                    </View>
                )}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    abonamentContainer: {
        marginBottom: 20,
        padding: 20,
        borderWidth: 1, // Ensure the border width is visible
        borderColor: 'lightblue', // Lighta blue border color
        borderRadius: 10,
        minHeight: 100,
        backgroundColor: '#11bbff', // Add a light blue background color
        overflow: 'hidden',
    },
    abonamentTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    abonamentBenef: {
        color: '#fff',
    },
});

export default Abonamente;
