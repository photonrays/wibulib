import { Dimensions, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS } from '../constants'
import { Stack, router, useFocusEffect } from 'expo-router'
import { FontAwesome6, Ionicons, Octicons, Feather, AntDesign } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { BoldText, NormalText } from '../components';
import { useManga } from '../contexts/useManga';
import LatestUpdateCard2 from '../components/LatestUpdateCard2';
import Pagination from '../components/Pagination';
import useLatestChapters from '../hooks/useLatestChapters';

const totalPage = 15

export default function latest() {
    const headerHeight = useHeaderHeight()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageRange, setPageRange] = useState([1])
    const { clearManga } = useManga();
    const { latestUpdates } = useLatestChapters(currentPage)
    const width = Dimensions.get('window').width

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
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.black, paddingTop: headerHeight, padding: 15 }}>
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
                {Object.entries(latestUpdates).length < 1 ? (
                    <Text>Loading</Text>
                ) : (
                    Object.entries(latestUpdates)
                        .map(([mangaId, { manga, chapterList }]) => {
                            return (
                                <LatestUpdateCard2 key={mangaId} manga={manga} chapterList={chapterList} />
                            );
                        })
                )}
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