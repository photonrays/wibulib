import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import { BoldText } from './BoldText';
import getCoverArt from '../utils/getCoverArt';
import { getMangaTitle } from '../utils/getMangaTitle';
import { SemiBoldText } from './SemiBoldText';
import { router } from 'expo-router';

export default function Card({ manga }) {
    const coverArt = getCoverArt(manga).toString()
    return (
        <Pressable onPress={() => router.navigate(`/manga/${manga.id}`)} style={{ width: 126, gap: 5, marginBottom: 10 }}>
            <Image source={{ uri: coverArt }} style={styles.cover} />
            <View style={{ overflow: 'hidden', justifyContent: "space-between" }}>
                <SemiBoldText numberOfLines={2} style={{ fontSize: 14 }}>
                    {getMangaTitle(manga)}
                </SemiBoldText>
            </View>
        </Pressable>
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
