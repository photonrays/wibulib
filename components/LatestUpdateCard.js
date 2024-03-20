import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins'

export default function LatestUpdateCard() {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <Text> Loading...</Text>;
    }
    return (
        <View style={{ height: 80, flexDirection: 'row', gap: 10, alignItems: 'stretch', marginBottom: 10 }}>
            <Image source={images.cover} style={styles.cover} />
            <View style={{ flex: 1, maxHeight: 80, overflow: 'hidden', justifyContent: "space-between" }}>
                <Text numberOfLines={1} style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, lineHeight: 20, color: COLORS.white }}>
                    Shouwaru Tensai Osananajimi to no Shoubu ni Makete Hatsutaiken o Zenbu Ubawareru Hanashi
                </Text>
                <Text numberOfLines={1} style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: COLORS.white }}>
                    Chap 7
                </Text>
                <Text numberOfLines={1} style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: COLORS.white }}>
                    BBB-translation
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cover: {
        width: 56,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    tagContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 5,
        backgroundColor: '#2c2c2c'
    },
    tag: {
        fontFamily: 'Poppins_700Bold',
        color: COLORS.white,
        fontSize: 10
    }
});
