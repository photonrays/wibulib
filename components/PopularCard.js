import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins'

export default function PopularCard() {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <Text> Loading...</Text>;
    }
    return (
        <View style={{ gap: 10 }}>
            <View style={{ height: 160, flexDirection: 'row', gap: 10, alignItems: 'stretch' }}>
                <Image source={images.cover} style={styles.cover} />
                <View style={{ flex: 1, maxHeight: 160, overflow: 'hidden', justifyContent: "space-between" }}>
                    <Text numberOfLines={6} style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, lineHeight: 22, color: COLORS.white }}>
                        Shouwaru Tensai Osananajimi to no Shoubu ni Makete Hatsutaiken o Zenbu Ubawareru Hanashi
                    </Text>
                    <Text numberOfLines={1} style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: COLORS.white }}>
                        Inukai Anzu, Konata Eru, Neibi
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, overflow: 'hidden' }}>
                <View style={styles.tagContainer}><Text style={styles.tag}>Suggestive</Text></View>
                <View style={styles.tagContainer}><Text style={styles.tag}>Suggestive</Text></View>
                <View style={styles.tagContainer}><Text style={styles.tag}>Suggestive</Text></View>
                <View style={styles.tagContainer}><Text style={styles.tag}>Suggestive</Text></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cover: {
        width: 112,
        height: 160,
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
