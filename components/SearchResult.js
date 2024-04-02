import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { COLORS, images } from '../constants'
import { SemiBoldText } from './SemiBoldText'
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { NormalText } from './NormalText';
import getCoverArt from '../utils/getCoverArt';
import { getMangaTitle } from '../utils/getMangaTitle';
import { router } from 'expo-router';


export default function SearchResult({ manga }) {
    const coverArt = getCoverArt(manga).toString()
    const title = getMangaTitle(manga)
    const author = manga?.relationships?.find((rela) => rela.type == 'author')

    return (
        <Pressable style={{
            flexDirection: 'row',
            width: '100%',
            height: 104,
            padding: 8,
            borderRadius: 8,
            marginVertical: 5,
            backgroundColor: COLORS.gray2,
            gap: 10,
            paddingHorizontal: 10
        }}
            onPress={() => router.push(`/manga/${manga.id}`)}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: coverArt }} style={styles.image} />
            </View>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <SemiBoldText numberOfLines={1}>{title}</SemiBoldText>
                <View style={styles.flexBox}>
                    <Ionicons name="person-outline" size={12} color={COLORS.white} />
                    <NormalText>{author.attributes.name}</NormalText>
                </View>
                <View style={[styles.flexBox, { backgroundColor: COLORS.gray, borderRadius: 5, paddingHorizontal: 10 }]}>
                    <FontAwesome name="circle" size={8} color={COLORS.white} />
                    <NormalText>{manga.attributes.status}</NormalText>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        maxWidth: 60,
        borderRadius: 5,
    },
    image: {
        flex: 1,
        maxHeight: '100%',
        maxWidth: '100%',
        resizeMode: 'cover',
        borderRadius: 5
    },
    flexBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    }
})
