import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import app from './firebaseConfig'; // Correctly import the initialized app
import { getDatabase, ref, onValue } from "firebase/database";

const Screen2 = () => {
    const [salutData, setSalutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const database = getDatabase(); // No need to pass `app` here
        const fetchData = () => {
            const dbRef = ref(database, '/Salut'); // Reference to 'Salut' key

            const unsubscribe = onValue(dbRef, snapshot => {
                const fetchedData = snapshot.val();
                // Check if data exists and update state accordingly
                if (fetchedData !== null) {
                    setSalutData(fetchedData);
                    setLoading(false); // Data fetched, so set loading to false
                }
            }, error => {
                console.error('Error fetching data: ', error);
                setLoading(false); // Error occurred, set loading to false
            });

            // Return the unsubscribe function to clean up the listener
            return () => unsubscribe();
        };

        fetchData();

        // Cleanup function
        return () => {
            // No need to fetch data again here, just clean up the listener
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text>This is Screen 2</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <View>
                    <Text>Salut: {salutData}</Text>
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
    },
});

export default Screen2;
