import React from 'react'
import { Dimensions, Image, ImageBackground, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import { COLORS, images } from '../constants'
import { Link, router } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements'
import { LinearGradient } from 'expo-linear-gradient';
import getCoverArt from '../utils/getCoverArt';
import { getMangaTitle } from '../utils/getMangaTitle';
import { FlatList } from 'react-native-gesture-handler';
import { NormalText } from './NormalText';
import { BoldText } from './BoldText';


export default function PopularCard({ manga }) {
    const headerHeight = useHeaderHeight()
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const coverArt = getCoverArt(manga)
    const mangaTitle = getMangaTitle(manga)
    const tags = manga.attributes.tags.filter((tag) => tag.attributes.group == 'genre')

    return (
        <ImageBackground source={{ uri: coverArt }} style={[styles.backgroundImage, { width: width, paddingTop: StatusBar.currentHeight + 110 }]} >
            <LinearGradient style={[styles.innerContainer, { top: 0, bottom: 0, width: width }]} colors={['rgba(0,0,0, 0.6)', COLORS.black]} locations={[0.6, 0.8]}></LinearGradient>
            <View style={{ height: 160, width: width, flexDirection: 'row', gap: 10, marginBottom: 10, marginTop: headerHeight, overflow: 'hidden', paddingHorizontal: 15 }}>
                <Pressable style={styles.imageContainer} onPress={() => router.navigate(`/manga/${manga.id}`)}>
                    <Image source={{ uri: coverArt }} style={styles.image} />
                </Pressable>
                <View style={{ flex: 1, maxHeight: 160, overflow: 'hidden', justifyContent: "space-between" }}>
                    <Link href={`/manga/${manga.id}`}>
                        <BoldText numberOfLines={6} style={{ fontSize: 18, lineHeight: 22 }}>
                            {mangaTitle}
                        </BoldText>
                    </Link>
                    <NormalText numberOfLines={1} style={{ fontSize: 14 }}>
                        {manga.relationships?.[0].attributes?.name}
                    </NormalText>
                </View>
            </View>
            {/* <View></View> */}
            <View style={{ paddingHorizontal: 15 }}>
                <FlatList
                    horizontal
                    data={tags}
                    keyExtractor={tag => tag.id}
                    renderItem={(obj, index) => <View style={styles.tagContainer}>
                        <Text style={styles.tag}>{obj.item.attributes.name.en}</Text>
                    </View>}
                />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        zIndex: -10,
        height: 'auto',
        paddingTop: 40,
        paddingBottom: 10,
        position: 'relative'
    },
    innerContainer: {
        flex: 1,
        position: 'absolute',
    },
    imageContainer: {
        width: 112,
        height: 160,
        backgroundColor: COLORS.black,
        borderRadius: 5
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        borderRadius: 5
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
