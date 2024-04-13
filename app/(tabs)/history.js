import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, DetailCard, SemiBoldText } from '../../components';
import { Octicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useMMKVObject } from 'react-native-mmkv';
import { storage } from '../../store/MMKV';
import { useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import isEmpty from '../../utils/isEmpty';


export default function History() {
    const width = Dimensions.get('window').width
    const [history, setHistory] = useMMKVObject('history', storage)
    const [sortedHistory, setSortedHistory] = useState({});

    useEffect(() => {
        if (history) {
            const today = new Date();

            const latestChapters = Object.entries(history)
                .map(([mangaId, mangaInfo]) => {
                    // Skip mangas with no chapters
                    if (!mangaInfo.items || isEmpty(mangaInfo.items)) {
                        return null;
                    }

                    const chapters = Object.entries(mangaInfo.items);

                    // Find the latest read chapter by max timestamp
                    const latestChapter = chapters.reduce((maxChapter, [chapterId, chapterData]) => {
                        if (chapterData.time > maxChapter.time) {
                            return { ...chapterData, chapterId }
                        }
                        return maxChapter
                    }, { time: 0 }
                    );

                    return {
                        ...latestChapter,
                        mangaId: mangaId,
                        mangaTitle: mangaInfo.title,
                        coverArt: mangaInfo.coverArt,
                        dateString: format(new Date(latestChapter.time), "dd/MM/yyyy"),
                    };
                })
                .filter((chapter) => chapter && chapter.time); // Filter out missing chapters and chapters with missing time

            // Sort chapters by date (descending - newest first)
            const sortedChapters = latestChapters.sort((a, b) => new Date(b.time) - new Date(a.time));

            const groupedHistory = sortedChapters.reduce((acc, chapter) => {
                const formattedDateString = chapter.dateString === format(today, "dd/MM/yyyy")
                    ? 'Today'
                    : chapter.dateString === format(addDays(today, -1), "dd/MM/yyyy")
                        ? 'Yesterday'
                        : chapter.dateString;

                acc[formattedDateString] = acc[formattedDateString] || [];
                acc[formattedDateString].push(chapter);
                return acc;
            }, {});

            setSortedHistory(groupedHistory);
        }
    }, [history]);

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={[styles.detail]}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                        <Octicons name="history" size={24} color={COLORS.white} />
                    </View>
                    <BoldText style={{ fontSize: 20 }}>HISTORY</BoldText>
                </View>
                <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    onPress={() => setHistory()}>
                    <MaterialIcons name="delete-sweep" size={30} color={COLORS.white} />
                </Pressable>
            </View>
            {!isEmpty(sortedHistory) ? Object.entries(sortedHistory).map(([key, value], index) => {
                return (
                    <View key={index} style={{ width: width, marginBottom: 20 }}>
                        <SemiBoldText style={{ fontSize: 16, marginBottom: 10 }}>{key}</SemiBoldText>
                        {value?.map((v, idx) => {
                            return (
                                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                    <DetailCard
                                        chapterId={v.chapterId}
                                        mangaId={v.mangaId}
                                        chapterTitle={v.title}
                                        coverArt={v.coverArt}
                                        date={v.time}
                                        mangaTitle={v.mangaTitle}
                                        containerStyle={{ flex: 5 }}
                                    />
                                    <Pressable style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.7 : 1 }]} onPress={() => setHistory(prev => {
                                        const historyCopy = { ...prev }
                                        delete historyCopy[v.mangaId].items[v.chapterId]

                                        return historyCopy
                                    })}>
                                        <Feather name="trash" size={24} color={COLORS.white} />
                                    </Pressable>
                                </View>
                            )
                        })}
                    </View>
                )
            })
                : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 60, backgroundColor: COLORS.gray, marginBottom: 20 }}>
                    <BoldText style={{ fontSize: 16 }}>NO HISTORY</BoldText>
                </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        padding: 15,
    },
    modalContainer: {
        alignSelf: 'center',
        backgroundColor: COLORS.gray,
        borderRadius: 20,
        padding: 20
    },
    detail: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 10,
        paddingTop: StatusBar.currentHeight,
    },
    dropdownButtonStyle: {
        width: '100%',
        height: 40,
        backgroundColor: COLORS.gray2,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        overflow: 'hidden',
        justifyContent: 'space-between'
    },
    dropdownMenuStyle: {
        backgroundColor: COLORS.gray2,
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    categoryItem: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.gray2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.gray2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    }
})
