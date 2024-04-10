import React from 'react'
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { COLORS } from '../constants'
import getCoverArt from '../utils/getCoverArt'
import { Link, router } from 'expo-router'
import { getMangaTitle } from '../utils/getMangaTitle'
import getChapterTitle from '../utils/getChapterTitle'
import { formatNowDistance } from '../utils/dateFns'
import { BoldText } from './BoldText'
import { NormalText } from './NormalText'

export default function DetailCard({ mangaId, chapterId, coverArt, mangaTitle, chapterTitle, translationGroup, date, containerStyle }) {
    const width = Dimensions.get('window').width;

    return (
        <Pressable onPress={() => router.push({ pathname: `/chapter/${chapterId}`, params: { mangaId } })} style={{ marginBottom: 15, ...containerStyle }}>
            <View style={{ flex: 1, height: 80, flexDirection: 'row', gap: 10 }}>
                <Image source={{ uri: coverArt }} style={styles.cover} />
                <View style={{ flex: 1, maxHeight: 80, overflow: 'hidden', justifyContent: "space-between" }}>
                    <BoldText numberOfLines={1} style={{ fontSize: 16, lineHeight: 20 }}>
                        {mangaTitle}
                    </BoldText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <NormalText numberOfLines={1} style={{ fontSize: 14 }}>
                            {chapterTitle}
                        </NormalText>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between' }}>
                        {translationGroup && <NormalText numberOfLines={1} style={{ fontSize: 12, flex: 1, flexShrink: 1 }}>
                            {translationGroup}
                        </NormalText>}
                        <NormalText numberOfLines={1} style={{ fontSize: 12 }}>
                            {formatNowDistance(new Date(date)) || ""}
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
