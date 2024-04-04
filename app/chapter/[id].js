import { Image, ScrollView, Text, View, Dimensions, Pressable, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { GestureDetector, Gesture, FlatList } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS } from '../../constants'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useChapterPages from '../../hooks/useChapterPages'
import { useEffect, useRef, useState } from 'react'
import { Feather, AntDesign } from '@expo/vector-icons';
import { BoldText, ChapterImage, NormalText, SemiBoldText } from '../../components'
import { useManga } from '../../contexts/useManga'
import { getMangaTitle } from '../../utils/getMangaTitle'
import getChapterTitle from '../../utils/getChapterTitle'
import Slider from '@react-native-community/slider';


export default function Chapter() {
    const { id, mangaId } = useLocalSearchParams();
    const { pages, isLoading } = useChapterPages(id)
    const width = Dimensions.get('window').width
    const height = Dimensions.get('screen').height
    const [showDetail, setShowDetail] = useState(false)
    const { manga, mangaFeed, updateManga, updateMangaByChapterId, clearManga } = useManga();
    const [chapterRelation, setChapterRelation] = useState(null)
    const [isSliderDragging, setIsSliderDragging] = useState(false);

    const [page, setPage] = useState(1);
    let currentIndex = 0;

    const flatlistRef = useRef(null)
    const sliderRef = useRef(null);


    const tap = Gesture.Tap()
        .maxDistance(50)
        .onStart(() => {
            runOnJS(setShowDetail)(!showDetail)
        });

    useEffect(() => {
        if (mangaId) {
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
        sliderRef.current.setNativeProps({ value: parseInt(currentIndex + 1) });
        setPage(currentIndex + 1)
    }

    if (!chapterRelation) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{
                    headerShown: false
                }} />
                <BoldText>Loading</BoldText>
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
                <Pressable onPress={() => { router.replace(`/manga/${manga.id}`) }} style={{ flex: 1 }}>
                    <SemiBoldText numberOfLines={1} style={{ fontSize: 18 }}>{getMangaTitle(manga)}</SemiBoldText>
                    <NormalText style={{ fontSize: 14 }}>Chapter {chapterRelation.curr.attributes.chapter}</NormalText>
                </Pressable>
            </View>
            <GestureDetector gesture={Gesture.Exclusive(tap)}>
                <View style={{ flex: 1 }}>
                    <FlatList
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
                </View>
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