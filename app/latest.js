import { ActivityIndicator, Dimensions, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { COLORS } from '../constants'
import { Stack, router, useFocusEffect } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { BoldText, NormalText } from '../components';
import { useManga } from '../contexts/useManga';
import { DetailCard2 } from '../components';
import Pagination from '../components/Pagination';
import useLatestChapters from '../hooks/useLatestChapters';
import getCoverArt from '../utils/getCoverArt';
import { getMangaTitle } from '../utils/getMangaTitle';
import isEmpty from '../utils/isEmpty';

const totalPage = 15

export default function latest() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageRange, setPageRange] = useState([1])
    const [refreshing, setRefreshing] = useState(false);
    const { clearManga } = useManga();
    const { latestUpdates, mutateLatestChapter } = useLatestChapters(currentPage)
    const width = Dimensions.get('window').width

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        mutateLatestChapter()
            .then(setRefreshing(false))
            .catch(err => console.log(err))
    }, []);

    useFocusEffect(
        useCallback(() => {
            clearManga()
        }, [])
    );

    useEffect(() => {
        const arr = [];
        for (let i = Math.max(currentPage - 2, 1); i <= Math.min(currentPage + 2, totalPage); i++) {
            arr.push(i);
        }
        setPageRange(arr);
    }, [currentPage]);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.black, padding: 15 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Stack.Screen options={{
                headerShown: false
            }} />

            <View style={[styles.detail, { width: width }]}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </Pressable>
                <BoldText style={{ fontSize: 20 }}>Latest Updates</BoldText>
            </View>

            <View>
                {isEmpty(latestUpdates)
                    ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator color={COLORS.primary} size={'large'} />
                    </View>
                    : Object.entries(latestUpdates)
                        .map(([mangaId, { manga, chapterList }]) => {
                            return (
                                <DetailCard2
                                    key={mangaId}
                                    mangaId={mangaId}
                                    coverArt={getCoverArt(manga).toString()}
                                    mangaTitle={getMangaTitle(manga)}
                                    chapterList={chapterList} />
                            );
                        })
                }
            </View>
            <Pagination totalPage={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} pageRange={pageRange} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        position: 'relative',
    },
    titleContainer: {
        paddingTop: StatusBar.currentHeight + 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingTop: StatusBar.currentHeight,
    }
})