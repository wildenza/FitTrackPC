import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import app from './firebaseConfig'; // Assuming your firebaseConfig is located in the parent directory

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const database = getDatabase(app);
        const usersRef = ref(database, 'Users');

        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const usersList = Object.entries(data).map(([key, value]) => ({ name: key, ...value }));
                setUsers(usersList);
                setLoading(false);
            } else {
                setUsers([]);
                setLoading(false);
            }
        });

        // Cleanup function
        return () => {
            // Unsubscribe the listener when the component unmounts
            unsubscribe();
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <Text style={styles.title}>Users Screen</Text>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <View>
                        {users.map((user, index) => (
                            <View key={index} style={styles.userContainer}>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.usrPackage}>Package: {user.Package}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%', // Set width to 100% to fill the entire screen width
        paddingHorizontal: 20,
        backgroundColor: '#192841', // Dark blue background color
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // White text color
    },
    userContainer: {
        marginBottom: 20, // Increase margin to make boxes bigger
        padding: 20, // Increase padding to make boxes bigger
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10, // Increase border radius for rounded corners
    },
    usrPackage:{
        color:'white',

    },
    userName: {
        fontWeight: 'bold',
        marginBottom: 10, // Increase margin to separate title from details
        color: '#fff', // White text color
    },
});

export default Users;
