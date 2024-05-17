//Users.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView , ImageBackground} from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { app } from './firebaseConfig'; // Adjust the import according to your project structure
const backgroundImage = require('../assets/gradient.jpeg');
const Users = () => {
    const [peopleInTheGym, setPeopleInTheGym] = useState(0);
    const [visibleUsers, setVisibleUsers] = useState([]);

    useEffect(() => {
        const database = getDatabase(app);
        const peopleInTheGymRef = ref(database, 'PersonsInTheGym');
        const usersRef = ref(database, 'users');

        const handlePeopleInTheGymChange = snapshot => {
            const peopleCount = snapshot.val();
            setPeopleInTheGym(peopleCount);
        };

        const handleUsersChange = snapshot => {
            const usersData = snapshot.val();
            const usersArray = Object.values(usersData).filter(user => user.isHeInTheGym && user.Privacy);
            setVisibleUsers(usersArray);
        };

        onValue(peopleInTheGymRef, handlePeopleInTheGymChange);
        onValue(usersRef, handleUsersChange);

        // Cleanup function
        return () => {
            off(peopleInTheGymRef, 'value', handlePeopleInTheGymChange);
            off(usersRef, 'value', handleUsersChange);
        };
    }, []);

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.text}>People in the Gym: {peopleInTheGym}</Text>
            {visibleUsers.length > 0 && (
                <View style={styles.visibleUsersContainer}>
                    <Text style={styles.subHeader}>Visible Persons:</Text>
                    {visibleUsers.map((user, index) => (
                        <Text key={index} style={styles.userName}>{user.firstName}</Text>
                    ))}
                </View>
            )}
        </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    visibleUsersContainer: {
        marginTop: 20,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userName: {
        fontSize: 16,
        marginVertical: 5,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Users;
