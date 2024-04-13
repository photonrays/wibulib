import { View, Dimensions, Pressable, StyleSheet, StatusBar, ActivityIndicator } from 'react-native'
import { GestureDetector, Gesture, FlatList } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { COLORS } from '../../constants'
import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import useChapterPages from '../../hooks/useChapterPages'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Feather, AntDesign } from '@expo/vector-icons';
import { BoldText, ChapterImage, NormalText, SemiBoldText } from '../../components'
import { useManga } from '../../contexts/useManga'
import { getMangaTitle } from '../../utils/getMangaTitle'
import getChapterTitle from '../../utils/getChapterTitle'
import Slider from '@react-native-community/slider';
import { useMMKVObject } from 'react-native-mmkv'
import { storage } from '../../store/MMKV'
import getCoverArt from '../../utils/getCoverArt'
import Zoom from 'react-native-zoom-reanimated'

let currentIndex = 0;

export default function Chapter() {
    const { id, mangaId } = useLocalSearchParams();
    const { pages } = useChapterPages(id)
    const width = Dimensions.get('window').width
    const [showDetail, setShowDetail] = useState(false)
    const { manga, mangaFeed, updateManga } = useManga();
    const [chapterRelation, setChapterRelation] = useState(null)

    const [history = {}, setHistory] = useMMKVObject('history', storage)

    const [page, setPage] = useState(1);

    const flatlistRef = useRef(null)
    const sliderRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setHistory(prev => ({ ...prev, [mangaId || manga?.id]: { ...prev[mangaId || manga?.id], items: { ...prev[mangaId || manga?.id]?.items, [id]: { ...prev[mangaId || manga?.id]?.items[id], page: currentIndex + 1, time: Date.now() } } } }))
            };
        }, [])
    );

    useEffect(() => {
        if (manga?.id && chapterRelation) {
            if (!history?.[mangaId || manga?.id]) {
                setHistory(prev => ({ ...prev, [mangaId || manga?.id]: { title: getMangaTitle(manga), coverArt: getCoverArt(manga), items: { [id]: { title: getChapterTitle(chapterRelation.curr), page: 0 } } } }))
            } else if (!history[mangaId || manga?.id].items?.[id]) {
                setHistory(prev => ({ ...prev, [mangaId || manga?.id]: { ...prev[mangaId || manga?.id], items: { ...prev[mangaId || manga?.id].items, [id]: { title: getChapterTitle(chapterRelation.curr), page: 0 } } } }))
            } else {
                const page = history[mangaId || manga?.id].items?.[id].page
                flatlistRef.current.scrollToIndex({ animated: false, index: page == 0 ? parseInt(page - 1) : 0 })
                sliderRef.current.setNativeProps({ value: parseInt(page) || 0 });
                setPage(page)
            }
        }
    }, [id, manga, chapterRelation])

    const tap = Gesture.Tap()
        .maxDuration(250)
        .maxDistance(50)
        .numberOfTaps(1)
        .onStart(() => {
            runOnJS(setShowDetail)(!showDetail)
        });

    useEffect(() => {
        if (!manga || mangaId && manga.id !== mangaId) {
            updateManga(mangaId)
        }
    }, [mangaId])

    useEffect(() => {
        if (mangaFeed) {
            const currCID = mangaFeed.findIndex(c => c.id === id)
            if (currCID !== -1) {
                let chapterList = {}
                if (currCID === 0 && mangaFeed.length === 1) {
                    chapterList = { prev: null, curr: mangaFeed[currCID], next: null }
                } else if (currCID === 0) {
                    chapterList = { prev: mangaFeed[currCID + 1], curr: mangaFeed[currCID], next: null }
                } else if (currCID === mangaFeed.length - 1) {
                    chapterList = { prev: null, curr: mangaFeed[currCID], next: mangaFeed[currCID - 1] }
                } else {
                    chapterList = { prev: mangaFeed[currCID + 1], curr: mangaFeed[currCID], next: mangaFeed[currCID - 1] }
                }
                setChapterRelation(chapterList)
            }
        }
    }, [mangaFeed])

    const handlePageChange = (page) => {
        setPage(page)
        currentIndex = page - 1
        flatlistRef.current.scrollToIndex({ animated: false, index: currentIndex })
    }

    const onViewableItemsChanged = ({ viewableItems }) => {
        currentIndex = viewableItems[0]?.index
    }

    const onMomentumScrollEnd = () => {
        sliderRef.current.setNativeProps({ value: parseInt(currentIndex + 1) || 0 });
        setPage(currentIndex + 1)
    }

    if (!chapterRelation) {
        return (
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black
            }}>
                <Stack.Screen options={{
                    headerShown: false
                }} />
                <ActivityIndicator color={COLORS.primary} size={'large'} />
            </View>)
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <StatusBar backgroundColor={`${showDetail ? 'rgba(0, 0, 0, 0.7)' : 'transparent'}`} />
            <View style={[styles.detail, { backgroundColor: 'rgba(0, 0, 0, 0.7)', top: StatusBar.currentHeight, width: width, display: showDetail ? 'flex' : 'none' }]}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}><Feather name="arrow-left" size={24} color={COLORS.white} /></Pressable>
                <Pressable onPress={() => { router.navigate(`/manga/${manga.id}`) }} style={{ flex: 1 }}>
                    <SemiBoldText numberOfLines={1} style={{ fontSize: 18 }}>{getMangaTitle(manga)}</SemiBoldText>
                    <NormalText style={{ fontSize: 14 }}>Chapter {chapterRelation.curr.attributes.chapter}</NormalText>
                </Pressable>
            </View>
            <GestureDetector gesture={Gesture.Exclusive(tap)}>
                <Zoom style={{ flex: 1 }}>
                    <FlatList
                        initialNumToRender={5}
                        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                        onViewableItemsChanged={onViewableItemsChanged}
                        onScrollBeginDrag={() => setShowDetail(false)}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        ref={flatlistRef}
                        contentContainerStyle={{ gap: 10, marginTop: StatusBar.currentHeight, paddingBottom: 40 }}
                        data={pages}
                        renderItem={(page, index) => <ChapterImage key={index} uri={page.item} />}
                        onScrollToIndexFailed={info => {
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                flatlistRef.current?.scrollToIndex({ index: info.index, animated: false });
                            });
                        }}
                        ListFooterComponent={(<View style={{ width: width, flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', gap: 50, minHeight: 50 }}>
                            <View style={{ flex: 1 }}>
                                {chapterRelation.prev ?
                                    <Pressable onPress={() => router.replace(`/chapter/${chapterRelation.prev.id}`)}
                                        style={styles.navigateButton}>
                                        <AntDesign name="left" size={30} color={COLORS.white} style={{ alignSelf: 'center' }} />
                                        <View style={{ flex: 1 }}>
                                            <BoldText style={{ fontSize: 18 }}>Previous: </BoldText>
                                            <SemiBoldText numberOfLines={2}>{getChapterTitle(chapterRelation.prev)}</SemiBoldText>
                                        </View>
                                    </Pressable>
                                    : <BoldText>No previous chapter</BoldText>}
                            </View>
                            <View style={{ flex: 1 }}>
                                {chapterRelation.next ?
                                    <Pressable onPress={() => router.replace(`/chapter/${chapterRelation.next.id}`)}
                                        style={styles.navigateButton}>
                                        <View style={{ flex: 1 }}>
                                            <BoldText style={{ fontSize: 18 }}>Next: </BoldText>
                                            <SemiBoldText numberOfLines={2}>{getChapterTitle(chapterRelation.next)}</SemiBoldText>
                                        </View>
                                        <AntDesign name="right" size={30} color={COLORS.white} style={{ alignSelf: 'center' }} />
                                    </Pressable>
                                    : <BoldText style={{ textAlign: 'center' }}>No next chapter</BoldText>}
                            </View>
                        </View>)}
                    />
                </Zoom>
            </GestureDetector>
            <View style={[styles.detail, { bottom: 10, width: width, display: showDetail ? 'flex' : 'none' }]}>
                <Pressable
                    onPress={() => router.replace(`/chapter/${chapterRelation.prev.id}`)}
                    style={[styles.skipButton, { opacity: chapterRelation.prev ? 1 : 0.6 }]}
                    disabled={chapterRelation.prev === null || undefined}>
                    <Feather name="skip-back" size={20} color={COLORS.white} />
                </Pressable>
                <View style={styles.sliderContainer}>
                    <NormalText>{page}</NormalText>
                    <Slider
                        ref={sliderRef}
                        style={{ flex: 1, display: showDetail ? 'flex' : 'none' }}
                        minimumValue={1}
                        maximumValue={pages.length}
                        onValueChange={page => handlePageChange(page)}
                        step={1}
                        tapToSeek={true}
                        renderStepNumber={true}
                    />
                    <NormalText>{pages.length}</NormalText>
                </View>
                <Pressable
                    onPress={() => router.replace(`/chapter/${chapterRelation.next.id}`)}
                    style={[styles.skipButton, { opacity: chapterRelation.next ? 1 : 0.6 }]}
                    disabled={chapterRelation.next === null || undefined}>
                    <Feather name="skip-forward" size={20} color={COLORS.white} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        position: 'relative',
    },
    detail: {
        position: 'absolute',
        height: 70,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 15
    },
    sliderContainer: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 50,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    navigateButton: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: 10,
        flex: 1,
    },
    skipButton: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 50,
    },
    disabledButton: {
        opacity: 80
    }
})