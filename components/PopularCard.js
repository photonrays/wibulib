import React from 'react'
import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import { Link } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements'
import { LinearGradient } from 'expo-linear-gradient';
import getCoverArt from '../utils/getCoverArt';
import { getMangaTitle } from '../utils/getMangaTitle';
import { FlatList } from 'react-native-gesture-handler';


export default function PopularCard({ manga }) {
    const headerHeight = useHeaderHeight()
    const width = Dimensions.get('window').width;
    const coverArt = getCoverArt(manga)
    const mangaTitle = getMangaTitle(manga)
    const tags = manga.attributes.tags.filter((tag) => tag.attributes.group == 'genre')

    return (
        <Link style={{ width: width, height: 'auto' }} href={`/manga/${manga.id}`}>
            <ImageBackground source={coverArt} style={styles.backgroundImage} >
                <LinearGradient style={[styles.innerContainer, { top: -headerHeight }]} colors={['rgba(0,0,0, 0.6)', COLORS.black]} locations={[0.6, 0.8]}></LinearGradient>
                <View style={{ height: 160, width: '100%', flexDirection: 'row', gap: 10, marginBottom: 10, marginTop: headerHeight, overflow: 'hidden', paddingHorizontal: 15 }}>
                    <Image source={coverArt} style={styles.cover} />
                    <View style={{ flex: 1, maxHeight: 160, overflow: 'hidden', justifyContent: "space-between" }}>
                        <Text numberOfLines={6} style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, lineHeight: 22, color: COLORS.white }}>
                            {mangaTitle}
                        </Text>
                        <Text numberOfLines={1} style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: COLORS.white }}>
                            {manga.relationships?.[0].attributes.name}
                        </Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                    <FlatList
                        horizontal
                        data={tags}
                        keyExtractor={tag => tag.id}
                        renderItem={(obj, index) => <View style={styles.tagContainer}><Text style={styles.tag}>{obj.item.attributes.name.en}</Text></View>}
                    />
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
        paddingTop: 40,
        position: 'relative'
    },
    innerContainer: {
        flex: 1,
        position: 'absolute',
        zIndex: -1,
        height: '130%',
        top: 0,
        width: '100%',
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
        backgroundColor: '#2c2c2c',
        marginRight: 10
    },
    tag: {
        fontFamily: 'Poppins_700Bold',
        color: COLORS.white,
        fontSize: 10
    }
});
