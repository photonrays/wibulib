import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { COLORS, images } from '../constants'
import { SemiBoldText } from './SemiBoldText'
import { Feather, FontAwesome } from '@expo/vector-icons';
import { NormalText } from './NormalText';
import getCoverArt from '../utils/getCoverArt';
import { getMangaTitle } from '../utils/getMangaTitle';


export default function SearchResult({ manga }) {
    const coverArt = getCoverArt(manga).toString()
    const title = getMangaTitle(manga)

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
            onPress={() => console.log("this run")}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: coverArt }} style={styles.image} />
            </View>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <SemiBoldText numberOfLines={1}>{title}</SemiBoldText>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={styles.flexBox}>
                        <Feather name="star" size={24} color={COLORS.white} />
                        <NormalText>8.08</NormalText>
                    </View>
                    <View style={styles.flexBox}>
                        <Feather name="bookmark" size={24} color={COLORS.white} />
                        <NormalText>24</NormalText>
                    </View>
                </View>
                <View style={[styles.flexBox, { backgroundColor: COLORS.gray2, borderRadius: 3, paddingHorizontal: 10 }]}>
                    <FontAwesome name="circle" size={8} color={COLORS.white} />
                    <NormalText>Complete</NormalText>
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
