import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import getCoverArt from '../utils/getCoverArt'
import { Link } from 'expo-router'
import { getMangaTitle } from '../utils/getMangaTitle'
import getChapterTitle from '../utils/getChapterTitle'
import { formatNowDistance } from '../utils/dateFns'

export default function LatestUpdateCard({ manga, chapterList }) {
    const width = Dimensions.get('window').width;
    const coverArt = getCoverArt(manga)
    const title = getMangaTitle(manga)
    const chapterTitle = getChapterTitle(chapterList?.[0])

    return (
        <Link href={`./manga/${manga.id}`}>
            <View style={{ width: width - 30, height: 80, flexDirection: 'row', gap: 10, alignItems: 'stretch', marginBottom: 10 }}>
                <Image source={coverArt} style={styles.cover} />
                <View style={{ flex: 1, maxHeight: 80, overflow: 'hidden', justifyContent: "space-between" }}>
                    <Text numberOfLines={1} style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, lineHeight: 20, color: COLORS.white }}>
                        {title}
                    </Text>
                    <Text numberOfLines={1} style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: COLORS.white }}>
                        {chapterTitle}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                        <Text numberOfLines={1} style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: COLORS.white }}>
                            {chapterList[0].relationships?.[0].attributes.name}
                        </Text>
                        <Text numberOfLines={1} style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: COLORS.white }}>
                            {formatNowDistance(new Date(chapterList[0].attributes?.readableAt)) || ""}
                        </Text>
                    </View>
                </View>
            </View>
        </Link>
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
