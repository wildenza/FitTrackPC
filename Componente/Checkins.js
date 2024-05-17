import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert , ImageBackground} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { app } from './firebaseConfig'; // Adjust the import if necessary
const backgroundImage = require('../assets/gradient.jpeg');

const Checkins = () => {
    const [checkins, setCheckins] = useState([]);
    const auth = getAuth(app);
    const database = getDatabase(app);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const uid = auth.currentUser.uid;
                const checksRef = ref(database, `users/${uid}/Checks`);
                const snapshot = await get(checksRef);

                if (snapshot.exists()) {
                    const checks = snapshot.val();
                    const sortedKeys = Object.keys(checks).sort();
                    const checkinData = [];

                    let currentCheckin = null;

                    sortedKeys.forEach(key => {
                        const check = checks[key];
                        if (check['Check-in']) {
                            currentCheckin = check['Check-in'];
                        } else if (check['Check-out'] && currentCheckin) {
                            const [checkinDate, checkinTime] = currentCheckin.split(',');
                            const formattedCheckinTime = checkinTime.replace(/^:/, ''); // Remove the first colon
                            const [checkoutDate, checkoutTime] = check['Check-out'].split(',');
                            const formattedCheckoutTime = checkoutTime.replace(/^:/, ''); // Remove the first colon

                            const formattedCheckin = new Date(`${checkinDate.replaceAll(':','-')} ${formattedCheckinTime}`);
                            const formattedCheckout = new Date(`${checkoutDate.replaceAll(':','-')} ${formattedCheckoutTime}`);
                            console.log("CheckinTime:" + formattedCheckin)
                            console.log("formattedCheckin:" + formattedCheckinTime)

                            const duration = Math.abs(formattedCheckout - formattedCheckin);
                            const durationMinutes = Math.floor((duration / 1000) / 60);
                            checkinData.push({
                                checkin: currentCheckin,
                                checkout: check['Check-out'],
                                duration: durationMinutes,
                            });
                            currentCheckin = null;
                        }
                    });

                    // Handle the case where there's an unmatched check-in (user is still in the gym)
                    if (currentCheckin) {
                        checkinData.push({
                            checkin: currentCheckin,
                            checkout: 'Still in the gym',
                            duration: null,
                        });
                    }

                    setCheckins(checkinData);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch check-ins');
            }
        };

        const checksRef = ref(database, `users/${auth.currentUser.uid}/Checks`);
        const unsubscribe = onValue(checksRef, (snapshot) => {
            fetchData(); // Fetch data whenever there's a change
        });

        // Cleanup function
        return () => {
            unsubscribe(); // Unsubscribe from real-time updates when the component unmounts
        };
    }, [auth, database]);

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Check-ins and Check-outs</Text>
            {checkins.map((entry, index) => (
                <View key={index} style={styles.box}>
                    <Text style={styles.text}>
                        <Text style={styles.boldText}>Check-in:</Text> {entry.checkin}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={styles.boldText}>Check-out:</Text> {entry.checkout}
                    </Text>
                    {entry.duration !== null ? (
                        <Text style={styles.text}>
                            <Text style={styles.boldText}>Duration:</Text> {entry.duration} minutes
                        </Text>
                    ) : (
                        <Text style={styles.text}>
                            <Text style={styles.boldText}>Duration:</Text> Currently in the gym
                        </Text>
                    )}
                </View>
            ))}
        </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop:70,
        color:'white',
    },
    box: {
        borderWidth: 1,
        borderColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 5,
    },
    text: {
        fontSize: 16,
        color: 'white',
    },
    boldText: {
        fontWeight: 'bold',
        color: 'white',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Checkins;
