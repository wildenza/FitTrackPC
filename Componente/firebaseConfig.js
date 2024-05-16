import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIxem0jHMHPX73SEMR2jrcuWiEsEUeSIk",
    authDomain: "fittrack-679b9.firebaseapp.com",
    projectId: "fittrack-679b9",
    storageBucket: "fittrack-679b9.appspot.com",
    messagingSenderId: "784243670131",
    appId: "1:784243670131:web:d74dfb42ba26c06faa3e06",
    measurementId: "G-TE4VHNEXYB",
    databaseURL: "https://fittrack-679b9-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Authentication with persistence
const database = getDatabase(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Export app, auth, and database instances
export { app, auth, database };
