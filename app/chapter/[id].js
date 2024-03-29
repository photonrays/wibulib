import { Image, ScrollView, Text, View, Dimensions, FlatList, Pressable, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS } from '../../constants'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import useChapterPages from '../../hooks/useChapterPages'
import FitImage from 'react-native-fit-image';
import { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { NormalText, SemiBoldText } from '../../components'
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
    const chapter = mangaFeed.find(c => c.id === id)
    const chapterTitle = getChapterTitle(chapter)

    const tap = Gesture.Tap()
        .maxDistance(50)
        .onStart(() => {
            runOnJS(setShowDetail)(!showDetail)
        });

    const title = getMangaTitle(manga)

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
                        renderItem={(page, index) => <FitImage source={{ uri: page.item }} />}
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