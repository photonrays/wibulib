import { View, StyleSheet, ScrollView, StatusBar, Pressable, Dimensions, Animated, RefreshControl, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler'
import { useState, useRef, useCallback } from 'react'
import { COLORS } from '../../constants'
import { SectionTextHeader, PopularCard, DetailCard, Card, NormalText, BoldText, SearchBar } from '../../components';
import { Link, Stack, router, useFocusEffect } from 'expo-router';
import useFeaturedTitles from '../../hooks/useFeatureTitles';
import { useManga } from '../../contexts/useManga';
import ReaAnimated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import useMangaRanking from '../../hooks/useMangaRanking';
import useLatestChapters from '../../hooks/useLatestChapters';
import getCoverArt from '../../utils/getCoverArt';
import { getMangaTitle } from '../../utils/getMangaTitle';
import getChapterTitle from '../../utils/getChapterTitle';
import isEmpty from '../../utils/isEmpty';
import { AntDesign } from '@expo/vector-icons';


export default function index() {
    const [headerHeight, setHeaderHeight] = useState(0)
    const { data: featuredTitles, isLoading } = useFeaturedTitles()
    const { data: topManga, isLoading: topMangaIsLoading } = useMangaRanking()
    const slideRef = useRef(null)
    const scrollX = useRef(new Animated.Value(0)).current
    const { clearManga } = useManga();
    const { latestUpdates, mutateLatestChapter } = useLatestChapters(1)
    const win = Dimensions.get('window')
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        mutateLatestChapter()
            .then(setRefreshing(false))
            .catch(err => console.log(err))
    }, []);

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

    useFocusEffect(
        useCallback(() => {
            clearManga()
        }, [])
    );

    return (
        <View style={{ flex: 1 }}>
            <ReaAnimated.View
                onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    setHeaderHeight(height)
                }}
                style={[styles.titleContainer, { width: win.width }, animatedStyles]}>
                <BoldText style={{ fontSize: 20, }}>WIBULIB</BoldText>
                <SearchBar />
            </ReaAnimated.View>
            <ScrollView style={styles.container}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <StatusBar backgroundColor={'transparent'} />
                <Stack.Screen options={{
                    headerShown: false,
                }} />
                <View style={{ marginBottom: 20 }}>
                    <View style={styles.header}>
                        <SectionTextHeader>
                            Popular New Titles
                        </SectionTextHeader>
                    </View>
                    {!isLoading && featuredTitles?.data
                        ? <FlatList
                            data={featuredTitles.data}
                            keyExtractor={(obj) => obj.id}
                            renderItem={(obj, index) => <PopularCard key={index} manga={obj.item} />}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            bounces={false}
                            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                            scrollEventThrottle={32}
                            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                            ref={slideRef}
                        />
                        : <View style={{ width: win.width, paddingTop: StatusBar.currentHeight + 10 }} >
                            <View style={{ height: 160, width: win.width, flexDirection: 'row', gap: 10, marginBottom: 10, marginTop: headerHeight, overflow: 'hidden', paddingHorizontal: 15 }}>
                                <View style={{ width: 112, height: 160, backgroundColor: COLORS.gray2, borderRadius: 5 }} />
                                <View style={{ flex: 1, maxHeight: 160, overflow: 'hidden', justifyContent: "space-between" }}>
                                    <View style={{ height: 50, width: '100%', backgroundColor: COLORS.gray2 }} />
                                    <View style={{ height: 30, width: '40%', backgroundColor: COLORS.gray2 }} />
                                </View>
                            </View>
                            <View style={{ height: 30, width: '100%', flexDirection: 'row', gap: 10, paddingHorizontal: 15, marginBottom: 10 }}>
                                <View style={{ height: 20, width: 70, backgroundColor: COLORS.gray2 }} />
                                <View style={{ height: 20, width: 70, backgroundColor: COLORS.gray2 }} />
                            </View>
                        </View>
                    }
                </View>
                <View style={{ marginBottom: 20, marginHorizontal: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <SectionTextHeader style={{ marginBottom: 10 }}>Latest Updates</SectionTextHeader>
                        <Pressable onPress={() => router.push("/latest")}
                            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                            <NormalText>View all</NormalText>
                        </Pressable>
                    </View>
                    {isEmpty(latestUpdates) ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={COLORS.primary} size={'large'} />
                        </View>
                    ) : (
                        Object.entries(latestUpdates)
                            .slice(0, 6)
                            .map(([mangaId, { manga, chapterList }]) => {
                                return (
                                    <DetailCard
                                        key={mangaId}
                                        chapterId={chapterList[0].id}
                                        mangaId={manga?.id}
                                        coverArt={getCoverArt(manga).toString()}
                                        mangaTitle={getMangaTitle(manga)}
                                        chapterTitle={getChapterTitle(chapterList?.[0])}
                                        translationGroup={chapterList[0].relationships?.[0].attributes?.name}
                                        date={chapterList[0].attributes?.readableAt} />
                                );
                            })
                    )}
                </View>

                <View style={{ marginBottom: 20, marginHorizontal: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <SectionTextHeader style={{ marginBottom: 10 }}>Top Mangas</SectionTextHeader>
                        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                            <NormalText>View All</NormalText>
                        </Pressable>
                    </View>
                    {!topMangaIsLoading && topManga?.data
                        ? <FlatList
                            data={topManga.data}
                            keyExtractor={(obj) => obj.id}
                            renderItem={(obj) => <Card manga={obj.item} />}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
                        />
                        : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={COLORS.primary} size={'large'} />
                        </View>
                    }
                </View>
                <View style={{ marginHorizontal: 15, padding: 10, backgroundColor: COLORS.gray, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <AntDesign name="exclamationcircleo" size={24} color={COLORS.white} />
                    <NormalText style={{}}>This is a third-party app powered by the <Link href="https://api.mangadex.org/docs/" style={{ color: COLORS.primary }}>MangaDex API</Link></NormalText>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        position: 'relative',
    },
    titleContainer: {
        flex: 1,
        position: 'absolute',
        top: 0,
        paddingTop: StatusBar.currentHeight + 20,
        zIndex: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15
    },
    header: {
        position: 'absolute',
        height: 80,
        justifyContent: 'flex-end',
        left: 15,
        top: StatusBar.currentHeight + 20,
        zIndex: 1,
        right: 20
    }
});