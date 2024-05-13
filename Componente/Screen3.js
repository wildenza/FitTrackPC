
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Screen3 = () => {
    return (
        <View style={styles.container}>
            <Text>This is Screen 3</Text>
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

export default Screen3;
