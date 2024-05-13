import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Screen1 = () => {
    return (
        <View style={styles.container}>
            <Text>This is Screen 1</Text>
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

// Set headerShown to false to remove the header
Screen1.navigationOptions = {
    headerShown: false,
};

export default Screen1;
