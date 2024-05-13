
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


export default Screen1;
