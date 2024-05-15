import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Screen1 = () => {
    return (
        <View style={styles.container}>
            <Text>ECRAN</Text>
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
});

// Set headerShown to false to remove the header
Screen1.options = {
    headerShown: false,
};
export default Screen1;
