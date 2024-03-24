import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import { Link } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements'
import { LinearGradient } from 'expo-linear-gradient';


export default function PopularCard() {
    const headerHeight = useHeaderHeight()

    return (
        <Link style={{ width: '100%', height: 'auto' }} href='./manga/1'>
            <ImageBackground source={images.cover} style={styles.backgroundImage} >
                <LinearGradient style={[styles.innerContainer, { top: -headerHeight }]} colors={['rgba(0,0,0, 0.6)', COLORS.black]} locations={[0.6, 0.8]}></LinearGradient>
                <View style={{ height: 160, width: '100%', flexDirection: 'row', gap: 10, marginBottom: 10, marginTop: headerHeight, overflow: 'hidden' }}>
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
            </ImageBackground>
        </Link>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        zIndex: -10,
        width: '100%',
        height: 'auto',
        padding: 15,
        paddingTop: 40,
        position: 'relative'
    },
    innerContainer: {
        flex: 1,
        position: 'absolute',
        zIndex: -1,
        left: -15,
        height: '130%',
        top: 0,
        width: '120%',
    },
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
