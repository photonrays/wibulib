import React from 'react'
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native'
import getCoverArt from '../utils/getCoverArt'
import { router } from 'expo-router'
import { NormalText } from './NormalText'
import { COLORS } from '../constants'
import { LinearGradient } from 'expo-linear-gradient'
import { getMangaTitle } from '../utils/getMangaTitle'

export default function Card2({ manga = null, title, cover, id }) {
    const width = Dimensions.get('window').width
    const coverArt = cover || getCoverArt(manga).toString()
    return (
        <Pressable onPress={() => router.navigate(`/manga/${id || manga.id}`)} style={[styles.container, { width: (width - 40) / 2, height: undefined, aspectRatio: 7 / 10 }]}>
            <Image source={{ uri: coverArt }} style={styles.cover} />
            <LinearGradient style={[styles.gradient]} colors={['transparent', 'rgba(0,0,0,0.7)']} locations={[0.6, 0.8]}></LinearGradient>
            <NormalText numberOfLines={2} style={{ position: 'absolute', bottom: 3, left: 6, right: 6 }}>{title || getMangaTitle(manga)}</NormalText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.gray,
        position: 'relative',
        borderRadius: 5,
        overflow: 'hidden'
    },
    cover: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    gradient: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
    }
})
