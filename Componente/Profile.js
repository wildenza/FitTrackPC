import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { onAuthStateChanged } from './firebaseConfig';
import { app, auth } from './firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { Picker } from '@react-native-picker/picker'
import DropDownPicker from 'react-native-dropdown-picker';


const GrabUserData = async () => {
    try {
        const auth = getAuth();
        const database = getDatabase(app);
        const uid = auth.currentUser.uid;

        const userRef = ref(database, `users/${uid}`);

        const userSnapshot = await get(userRef);
        const userData = userSnapshot.exists() ? userSnapshot.val() : null;

        if (!userData) {
            console.error('User data not found');
            return null;
        }

        return userData;
    } catch (error) {
        console.error('Error grabbing user data:', error.message);
        return null;
    }
};

const Profile = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        location: '',
        phone: '',
        Privacy: false,
        address: '',
        Subscription: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await GrabUserData();
                if (userData) {
                    setUserData(userData);
                } else {
                    console.error('User data not found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                fetchData();
            } else {
                setUserEmail('');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogOut = async () => {
        try {
            await auth.signOut();
            console.log('User logged out successfully!');
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    const handleResetPassword = () => {
        const email = auth.currentUser.email;
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    Alert.alert("Password Reset Email Sent", "Check your email inbox to reset your password.");
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const firestore = getFirestore(app);
                const userRef = doc(firestore, 'users', user.uid);
                await deleteDoc(userRef);
                await user.delete();
                console.log('User account deleted successfully!');
            }
        } catch (error) {
            console.error('Delete account error:', error.message);
        }
    };

    const handlePrivacyChange = async () => {
        try {
            const uid = auth.currentUser.uid;
            const db = getDatabase(app);
            const userRef = ref(db, 'users/' + uid +'/Privacy');
            const newValue = !userData.Privacy; // Toggle privacy value
            await set(userRef, newValue);
            setUserData({ ...userData, Privacy: newValue });
            console.log('Succesfully updated privacy setting!')
        } catch (error) {
            console.error('Error updating privacy setting:', error.message);
        }
    };

    const getPrivacyStatus = (value) => {
        return value ? 'Invisible' : 'Visible';
    };





    return (
        <ImageBackground source={require('../assets/download.jpeg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.blueBox}>
                    <Text style={styles.surnameText}>User Email: {userEmail}</Text>
                    <Text style={styles.nameText}>Name: {userData.firstName}</Text>
                    <Text style={styles.surnameText}>Last Name: {userData.lastName}</Text>
                    <Text style={styles.surnameText}>Date of Birth: {(userData.dob).split('T')[0]}</Text>
                    <Text style={styles.surnameText}>Phone: {userData.phone}</Text>
                    <Text style={styles.surnameText}>Location: {userData.location}</Text>
                    <Text style={styles.surnameText}>Address: {userData.address}</Text>
                    <Text style={styles.surnameText}>Subscription: {JSON.stringify(userData.Subscription)}</Text>
                    <Text style={styles.label}>Privacy: {userData.Privacy ? 'Invisible' : 'Visible'}</Text>
                    <TouchableOpacity style={styles.button} onPress={handlePrivacyChange}>
                        <Text style={styles.buttonText}>Change Privacy</Text>
                    </TouchableOpacity>
                </View>


                <TouchableOpacity style={styles.button} onPress={handleLogOut}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                    <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
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
    blueBox: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#0d0063',
        borderRadius: 10,
        backgroundColor: '#0d0063',
        minWidth: 200,
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',

    },

    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
    },
    picker: {
        height: 40,
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        color: 'red',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    surnameText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },

    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    buttonText: {
        color: '#0d0063',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default Profile;
