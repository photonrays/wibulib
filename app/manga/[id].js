import { View, Text, StyleSheet, Image, Pressable, ScrollView, ImageBackground, FlatList, Dimensions } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS, images } from '../../constants';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';
import Chapter from '../../components/Chapter';
import { LinearGradient } from 'expo-linear-gradient';
import { useManga } from '../../contexts/useManga';
import { useEffect } from 'react';
import getCoverArt from '../../utils/getCoverArt';
import { getMangaTitle } from '../../utils/getMangaTitle';
import { BoldText, NormalText, SemiBoldText } from '../../components';


export default function Manga() {
    const { id } = useLocalSearchParams()
    const { updateManga, manga, mangaFeed } = useManga()
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    useEffect(() => {
        updateManga(id)
    }, [])

    const coverArt = getCoverArt(manga).toString()
    const title = getMangaTitle(manga)
    const tags = manga?.attributes?.tags?.filter((tag) => tag.attributes.group == 'genre')

    const headerHeight = useHeaderHeight()
    return (
        <ScrollView style={{ flex: 1, gap: 10, backgroundColor: COLORS.black }}>
            <Stack.Screen options={{
                title: "",
                headerShown: true,
                headerTransparent: true,
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'Poppins_700Bold',
                },
                headerBackVisible: true
            }} />
            <ImageBackground source={{ uri: coverArt }} style={[styles.backgroundImage, { paddingTop: headerHeight, width: width }]} >
                <LinearGradient style={[styles.innerContainer, { top: -headerHeight, bottom: 0, width: width }]} colors={['rgba(0,0,0, 0.7)', COLORS.black]} locations={[0.5, 0.7]}></LinearGradient>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'stretch', marginBottom: 10 }}>
                    <Image source={{ uri: coverArt }} style={styles.cover} />
                    <View style={{ flex: 1, overflow: 'hidden', justifyContent: "center", gap: 4 }}>
                        <BoldText numberOfLines={10} style={{ fontSize: 18, lineHeight: 22 }}>
                            {title}
                        </BoldText>
                        {/* <View></View> */}
                        <View numberOfLines={3} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="person-outline" size={12} color={COLORS.white} />
                            <NormalText style={{ fontSize: 14 }}>
                                {manga?.relationships?.[0].attributes.name}
                            </NormalText>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <MaterialCommunityIcons name="clock-outline" size={12} color={COLORS.white} />
                            <NormalText style={{ fontSize: 14 }}>
                                {manga?.attributes.status}
                            </NormalText>
                        </View>
                    </View>
                </View>
            </ImageBackground>

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10, paddingHorizontal: 15 }}>
                <Pressable style={{ padding: 6, borderRadius: 5, backgroundColor: COLORS.primary }}>
                    <Feather name="bookmark" size={24} color={COLORS.white} />
                </Pressable>
                <Pressable style={{ padding: 6, paddingHorizontal: 20, borderRadius: 5, backgroundColor: COLORS.gray, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10, flex: 1 }}>
                    <Feather name="book-open" size={24} color={COLORS.white} />
                    <NormalText>Read</NormalText>
                </Pressable>
            </View>

            <NormalText numberOfLines={3} style={{ fontSize: 12, paddingHorizontal: 15, marginBottom: 10 }}>
                {manga?.attributes.description.en}
            </NormalText>

            <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={tags}
                    keyExtractor={tag => tag.id}
                    renderItem={(obj, index) => <View style={styles.tagContainer}><Text style={styles.tag}>{obj.item.attributes.name.en}</Text></View>}
                />
            </View>
            <View style={{ paddingHorizontal: 15 }}>
                <SemiBoldText style={{ marginVertical: 10, fontSize: 16 }}>{mangaFeed?.length} chapters</SemiBoldText>
                <View style={{ gap: 15, marginBottom: 15 }}>
                    {mangaFeed?.map((obj, index) => <Chapter key={index} chapter={obj} />)}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'relative',
        zIndex: -10,
        height: 'auto',
        padding: 15,
    },
    innerContainer: {
        flex: 1,
        position: 'absolute',
    },
    cover: {
        width: 98,
        height: 140,
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
