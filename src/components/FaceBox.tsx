import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function FaceBox({ origin, size, name }) {
    
    const styles = StyleSheet.create({
        box: {
            height: parseInt(size.height),
            width: parseInt(size.width),
            left: parseInt(origin.x),
            top: parseInt(origin.y),
            position: 'absolute',
            borderWidth: 1,
            borderColor:'yellow',
            zIndex:1000
        },
        name: {
            fontSize: 10,
            color:'white'
        }
    })
    
    return (
        <View style={styles.box}>
            <Text style={styles.name}>{name}</Text>
        </View>
    )
}
