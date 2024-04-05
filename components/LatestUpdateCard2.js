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

export default function LatestUpdateCard2({ manga, chapterList }) {
    const width = Dimensions.get('window').width;
    const coverArt = getCoverArt(manga).toString()
    const title = getMangaTitle(manga)

    const InnerContent = ({ chapter }) => {
        const chapterTitle = getChapterTitle(chapter)
        return (
            <Pressable onPress={() => router.push({ pathname: `./chapter/${chapter?.id}`, params: { mangaId: manga.id } })} style={styles.chapter}>
                <BoldText numberOfLines={1} style={{ fontSize: 16, lineHeight: 20 }}>
                    {chapterTitle}
                </BoldText>
                <NormalText numberOfLines={1} style={{ fontSize: 14 }}>
                    {chapter?.relationships?.[0].attributes?.name || "No Group"}
                </NormalText>
                <NormalText numberOfLines={1} style={{ fontSize: 12 }}>
                    {formatNowDistance(new Date(chapter?.attributes?.readableAt)) || ""}
                </NormalText>
            </Pressable>
        )
    }

    return (
        <Pressable style={{ marginBottom: 15, gap: 10, backgroundColor: COLORS.gray, padding: 8, borderRadius: 5 }}>
            <View style={{ borderColor: 'rgba(128, 128, 128, 0.5)', borderBottomWidth: 1 }}>
                <BoldText numberOfLines={1}>{title}</BoldText>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Image source={{ uri: coverArt }} style={styles.cover} />
                <View style={{ flex: 1, gap: 10 }}>
                    {chapterList?.map((c, index) => <InnerContent key={index} chapter={c} />)}
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
    chapter: {
        height: 80,
        overflow: 'hidden',
        justifyContent: "space-between",
    }
});
