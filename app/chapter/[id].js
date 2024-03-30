import { Image, ScrollView, Text, View, Dimensions, FlatList, Pressable, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS } from '../../constants'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useChapterPages from '../../hooks/useChapterPages'
import { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { BoldText, ChapterImage, NormalText, SemiBoldText } from '../../components'
import { useManga } from '../../contexts/useManga'
import { getMangaTitle } from '../../utils/getMangaTitle'
import getChapterTitle from '../../utils/getChapterTitle'


export default function Chapter() {
    const { id } = useLocalSearchParams();
    const { pages, isLoading } = useChapterPages(id)
    const width = Dimensions.get('window').width
    const height = Dimensions.get('screen').height
    const [showDetail, setShowDetail] = useState(false)
    const { manga, mangaFeed } = useManga();
    const [chapterRelation, setChapterRelation] = useState({})
    const chapter = mangaFeed.find(c => c.id === id)

    const tap = Gesture.Tap()
        .maxDistance(50)
        .onStart(() => {
            runOnJS(setShowDetail)(!showDetail)
        });

    console.log(manga)

    const chapterTitle = getChapterTitle(chapter)
    const title = getMangaTitle(manga)

    useEffect(() => {
        if (mangaFeed) {
            let chapterList = {}
            const currCID = mangaFeed.findIndex(c => c.id === id)
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
    }, [mangaFeed])

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <StatusBar backgroundColor={`${showDetail ? 'rgba(0, 0, 0, 0.7)' : 'transparent'}`} />
            <View style={[styles.detail, { top: StatusBar.currentHeight, width: width, display: showDetail ? 'flex' : 'none' }]}>
                <Pressable onPress={() => router.back()} style={{ paddingVertical: 15, paddingHorizontal: 5 }}><Feather name="arrow-left" size={24} color={COLORS.white} /></Pressable>
                <View style={{ flex: 1 }}>
                    <SemiBoldText numberOfLines={1} style={{ fontSize: 16 }}>{title}</SemiBoldText>
                    <NormalText style={{ fontSize: 14 }}>Chapter {chapter.attributes.chapter}</NormalText>
                </View>
            </View>
            <GestureDetector gesture={Gesture.Exclusive(tap)}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        contentContainerStyle={{ gap: 10, marginTop: StatusBar.currentHeight, paddingBottom: 40 }}
                        data={pages}
                        renderItem={(page, index) => <ChapterImage uri={page.item} />}
                        ListFooterComponent={(<View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                            <View style={{ flex: 1 }}>
                                {chapterRelation.prev ?
                                    <>
                                        <BoldText style={{ fontSize: 18 }}>Previous: </BoldText>
                                        <SemiBoldText>{getChapterTitle(chapterRelation.prev)}</SemiBoldText>
                                    </>
                                    : <BoldText>No previous chapter</BoldText>}
                            </View>
                            <View style={{ flex: 1 }}>
                                {chapterRelation.next ?
                                    <>
                                        <BoldText style={{ fontSize: 18 }}>Next: </BoldText>
                                        <SemiBoldText>{getChapterTitle(chapterRelation.next)}</SemiBoldText>
                                    </>
                                    : <BoldText>No next chapter</BoldText>}
                            </View>
                        </View>)}
                    />
                </View>
            </GestureDetector>
            <View style={[styles.detail, { bottom: 0, width: width, display: showDetail ? 'flex' : 'none' }]}>
                <Text>This is detail</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 15
    }
})