import { View, Text, StyleSheet, FlatList, TouchableHighlight, Image, ScrollView, StatusBar, Pressable, Dimensions, Animated } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react'
import { COLORS } from '../../constants'
import { SectionTextHeader, PopularCard, LatestUpdateCard, Card, NormalText, BoldText, SearchBar } from '../../components';
import { Stack, router, useFocusEffect } from 'expo-router';
import useFeaturedTitles from '../../hooks/useFeatureTitles';
import { useManga } from '../../contexts/useManga';
import ReaAnimated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Card2 from '../../components/Card2';
import useMangaRanking from '../../hooks/useMangaRanking';
import useLatestChapters from '../../hooks/useLatestChapters';


export default function index() {
    const [headerHeight, setHeaderHeight] = useState(0)
    const { data: featuredTitles, isLoading, error } = useFeaturedTitles()
    const { data: topManga, isLoading: topMangaIsLoading } = useMangaRanking()
    const slideRef = useRef(null)
    const scrollX = useRef(new Animated.Value(0)).current
    const { clearManga } = useManga();
    const { latestUpdates } = useLatestChapters(1)
    const win = Dimensions.get('window')

    const transparentValue = useSharedValue(0)

    const handleScroll = (event) => {
        const offset = event.nativeEvent.contentOffset.y
        if (offset < (headerHeight)) {
            transparentValue.value = Math.min(offset / headerHeight, 1)
        } else if (transparentValue !== 1) {
            transparentValue.value = 1
        }
    }

    console.log("re render")

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
                    {!isLoading && featuredTitles?.data && <FlatList
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
                    />}
                </View>
                <View style={{ marginBottom: 20, marginHorizontal: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <SectionTextHeader style={{ marginBottom: 10 }}>Latest Updates</SectionTextHeader>
                        <TouchableHighlight onPress={() => router.push("/latest")}>
                            <NormalText>View all</NormalText>
                        </TouchableHighlight>
                    </View>
                    {Object.entries(latestUpdates).length < 1 ? (
                        <Text>Loading</Text>
                    ) : (
                        Object.entries(latestUpdates)
                            .slice(0, 6)
                            .map(([mangaId, { manga, chapterList }]) => {
                                return (
                                    <LatestUpdateCard key={mangaId} manga={manga} chapterList={chapterList} />
                                );
                            })
                    )}
                </View>

                <View style={{ marginBottom: 20, marginHorizontal: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <SectionTextHeader style={{ marginBottom: 10 }}>Top Mangas</SectionTextHeader>
                        <TouchableHighlight>
                            <NormalText>View All</NormalText>
                        </TouchableHighlight>
                    </View>
                    {!topMangaIsLoading && topManga?.data && <FlatList
                        data={topManga.data}
                        keyExtractor={(obj) => obj.id}
                        renderItem={(obj, index) => <Card manga={obj.item} />}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
                    />}
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