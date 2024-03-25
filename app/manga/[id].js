import { View, Text, StyleSheet, Image, Pressable, ScrollView, ImageBackground, FlatList } from 'react-native';
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


export default function Manga() {
    const { id } = useLocalSearchParams()
    const { updateManga, manga, mangaFeed } = useManga()
    console.log(mangaFeed)

    useEffect(() => {
        updateManga(id)
    }, [])

    const coverArt = getCoverArt(manga)
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
                    fontWeight: 'bold',
                },
                headerBackVisible: true
            }} />
            <ImageBackground source={coverArt} style={[styles.backgroundImage, { paddingTop: headerHeight }]} >
                <LinearGradient style={[styles.innerContainer, { top: -headerHeight }]} colors={['rgba(0,0,0, 0.6)', COLORS.black]} locations={[0.5, 0.7]}></LinearGradient>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'stretch', marginBottom: 10 }}>
                    <Image source={coverArt} style={styles.cover} />
                    <View style={{ flex: 1, overflow: 'hidden', justifyContent: "center", gap: 4 }}>
                        <Text numberOfLines={10} style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, lineHeight: 22, color: COLORS.white }}>
                            {title}
                        </Text>

                        <View numberOfLines={3} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="person-outline" size={12} color={COLORS.white} />
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: COLORS.white }}>
                                {manga?.relationships?.[0].attributes.name}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <MaterialCommunityIcons name="clock-outline" size={12} color={COLORS.white} />
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: COLORS.white }}>
                                {manga?.attributes.status}
                            </Text>
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
                    <Text style={{ color: COLORS.white, fontFamily: 'Poppins_400Regular', fontSize: 16 }}>Read</Text>
                </Pressable>
            </View>

            <Text numberOfLines={3} style={{ fontFamily: 'Poppins_400Regular', color: COLORS.white, fontSize: 12, paddingHorizontal: 15, marginBottom: 10 }}>
                {manga?.attributes.description.en}
            </Text>

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
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: COLORS.white, marginVertical: 10 }}>{mangaFeed?.length} chapters</Text>
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
        width: '100%',
        height: 'auto',
        padding: 15,
    },
    innerContainer: {
        flex: 1,
        position: 'absolute',
        zIndex: -1,
        left: -15,
        height: '180%',
        width: '200%',
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
