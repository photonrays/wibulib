import { View, Text, StyleSheet, Image, Pressable, ScrollView, ImageBackground, Dimensions, StatusBar } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { COLORS } from '../../constants';
import { Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import Chapter from '../../components/Chapter';
import { LinearGradient } from 'expo-linear-gradient';
import { useManga } from '../../contexts/useManga';
import { useEffect, useState } from 'react';
import getCoverArt from '../../utils/getCoverArt';
import { getMangaTitle } from '../../utils/getMangaTitle';
import { BoldText, NormalText, SemiBoldText, BookmarkModal } from '../../components';
import { storage } from '../../store/MMKV';
import { useMMKVObject } from 'react-native-mmkv';
import ReAnimated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function Manga() {
    const [library, setLibrary] = useMMKVObject('library', storage)
    const [history, setHistory] = useMMKVObject('history', storage)
    const [isVisible, setIsVisible] = useState(false)
    const [modalType, setModalType] = useState('add')

    const { id } = useLocalSearchParams()
    const { manga, mangaFeed, updateManga } = useManga()
    const width = Dimensions.get('window').width;

    const coverArt = getCoverArt(manga).toString()
    const title = getMangaTitle(manga)
    const tags = manga?.attributes?.tags?.filter((tag) => tag.attributes.group == 'genre')

    const [headerHeight, setHeaderHeight] = useState(0)
    const transparentValue = useSharedValue(0)

    const handleScroll = (event) => {
        const offset = event.nativeEvent.contentOffset.y
        if (offset < (headerHeight)) {
            transparentValue.value = Math.min(offset / headerHeight, 1)
        } else if (transparentValue.value !== 1) {
            transparentValue.value = 1
        }
    }

    const animatedStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                transparentValue.value,
                [0, 1],
                ['rgba(25, 26, 28, 0)', 'rgba(25, 26, 28, 1)']
            ),
        };
    });

    useEffect(() => {
        if (!manga || id !== manga?.id) {
            updateManga(id)
        }
        if (history[id]) {
            console.log(history[id])
        }
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ReAnimated.View
                onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    setHeaderHeight(height)
                }}
                style={[styles.header, animatedStyles]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Pressable onPress={() => router.back()} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                        <Feather name="arrow-left" size={24} color={COLORS.white} />
                    </Pressable>
                    <BoldText numberOfLines={1} style={{ fontSize: 20, paddingTop: 5 }}>{title}</BoldText>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Pressable>
                        <MaterialIcons name="select-all" size={28} color={COLORS.white} />
                    </Pressable>
                    <Pressable>
                        <MaterialIcons name="deselect" size={28} color={COLORS.white} />
                    </Pressable>
                </View>
            </ReAnimated.View>
            <ScrollView style={{ flex: 1, gap: 10, backgroundColor: COLORS.black, position: 'relative' }} onScroll={handleScroll}>
                <Stack.Screen options={{
                    title: "",
                    headerShown: false,
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontFamily: 'Poppins_700Bold',
                    },
                    headerBackVisible: false,
                    headerLeft: () => <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                        <Feather name="arrow-left" size={24} color={COLORS.white} />
                    </Pressable>,

                }} />
                <BookmarkModal type={modalType} isVisible={isVisible} setIsVisible={setIsVisible} id={manga?.id} coverArt={coverArt} title={title} library={library} setLibrary={setLibrary} />
                <ImageBackground source={{ uri: coverArt }} style={[styles.backgroundImage, { paddingTop: 100, width: width }]} >
                    <LinearGradient style={[styles.innerContainer, { top: -100, bottom: 0, width: width }]} colors={['rgba(0,0,0, 0.7)', COLORS.black]} locations={[0.5, 0.7]}></LinearGradient>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'stretch', marginBottom: 10 }}>
                        <Image source={{ uri: coverArt }} style={styles.cover} />
                        <View style={{ flex: 1, overflow: 'hidden', justifyContent: "center", gap: 4 }}>
                            <BoldText numberOfLines={10} style={{ fontSize: 18, lineHeight: 22 }}>
                                {title}
                            </BoldText>
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
                    {Object.values(library).filter(c => c.items[manga?.id]).length != 0
                        ? <Pressable onPress={() => { setModalType('edit'); setIsVisible(true) }} style={({ pressed }) => [{ padding: 6, borderRadius: 5, backgroundColor: COLORS.primary, opacity: pressed ? 0.7 : 1 }]}>
                            <Feather name="check" size={24} color={COLORS.white} />
                        </Pressable>
                        : <Pressable onPress={() => { setModalType('add'); setIsVisible(true) }}
                            style={({ pressed }) => [{ padding: 6, borderRadius: 5, backgroundColor: COLORS.primary, opacity: pressed ? 0.7 : 1 }]}>
                            <Feather name="bookmark" size={24} color={COLORS.white} />
                        </Pressable>
                    }
                    <Pressable
                        // onPress={}
                        style={({ pressed }) => [{
                            padding: 6,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            backgroundColor: COLORS.gray,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 10,
                            flex: 1,
                            opacity: pressed ? 0.7 : 1
                        }]}>
                        <Feather name="book-open" size={24} color={COLORS.white} />
                        <NormalText>Read</NormalText>
                    </Pressable>
                </View>

                <NormalText numberOfLines={3} style={{ fontSize: 12, paddingHorizontal: 15, marginBottom: 10 }}>
                    {manga?.attributes.description.en}
                </NormalText>

                <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {tags?.map((tag, index) => <View key={index} style={styles.tagContainer}>
                            <Text style={styles.tag}>{tag.attributes.name.en}</Text>
                        </View>)}
                    </View>
                </View>
                <SemiBoldText style={{ marginVertical: 10, fontSize: 16, paddingHorizontal: 15 }}>{mangaFeed?.length} chapters</SemiBoldText>
                <View style={{ marginBottom: 15 }}>
                    {mangaFeed?.map((obj, index) => <Chapter key={index} chapter={obj} history={history[id]} />)}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 100,
        backgroundColor: COLORS.gray,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 15,
        zIndex: 10
    },
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
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#2c2c2c',
    },
    tag: {
        fontFamily: 'Poppins_700Bold',
        color: COLORS.white,
        fontSize: 10
    }
});
