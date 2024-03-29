import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins'
import { BoldText } from './BoldText';

export default function Card() {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <Text> Loading...</Text>;
    }
    return (
        <View style={{ width: 126, gap: 10, marginBottom: 10 }}>
            <Image source={images.cover} style={styles.cover} />
            <View style={{ overflow: 'hidden', justifyContent: "space-between" }}>
                <BoldText numberOfLines={2} style={{ fontSize: 16, lineHeight: 20 }}>
                    Shouwaru Tensai Osananajimi to no Shoubu ni Makete Hatsutaiken o Zenbu Ubawareru Hanashi
                </BoldText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cover: {
        width: 126,
        height: 180,
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
    }
});
