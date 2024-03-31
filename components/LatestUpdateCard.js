import React from 'react'
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import getCoverArt from '../utils/getCoverArt'
import { Link, router } from 'expo-router'
import { getMangaTitle } from '../utils/getMangaTitle'
import getChapterTitle from '../utils/getChapterTitle'
import { formatNowDistance } from '../utils/dateFns'
import { BoldText } from './BoldText'
import { NormalText } from './NormalText'

export default function LatestUpdateCard({ manga, chapterList }) {
    const width = Dimensions.get('window').width;
    const coverArt = getCoverArt(manga).toString()
    const title = getMangaTitle(manga)
    const chapterTitle = getChapterTitle(chapterList?.[0])

    return (
        <Pressable onPress={() => router.push({ pathname: `./chapter/${chapterList?.[0].id}`, params: { mangaId: manga.id } })} style={{ marginBottom: 15 }}>
            <View style={{ width: width - 30, height: 80, flexDirection: 'row', gap: 10, alignItems: 'stretch' }}>
                <Image source={{ uri: coverArt }} style={styles.cover} />
                <View style={{ flex: 1, maxHeight: 80, overflow: 'hidden', justifyContent: "space-between" }}>
                    <BoldText numberOfLines={1} style={{ fontSize: 16, lineHeight: 20 }}>
                        {title}
                    </BoldText>
                    <NormalText numberOfLines={1} style={{ fontSize: 14 }}>
                        {chapterTitle}
                    </NormalText>
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                        <NormalText numberOfLines={1} style={{ fontSize: 12 }}>
                            {chapterList[0].relationships?.[0].attributes.name}
                        </NormalText>
                        <NormalText numberOfLines={1} style={{ fontSize: 12 }}>
                            {formatNowDistance(new Date(chapterList[0].attributes?.readableAt)) || ""}
                        </NormalText>
                    </View>
                </View>
            </View>
        </Pressable>
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
