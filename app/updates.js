import { View, StyleSheet, StatusBar, ScrollView, Dimensions, RefreshControl, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useMMKVObject } from 'react-native-mmkv';
import { useCallback, useState } from 'react';
import { format } from 'date-fns';
import { COLORS } from '../constants';
import { storage } from '../store/MMKV';
import { BoldText, NormalText, SemiBoldText } from '../components';
import { useManga } from '../contexts/useManga';
import isEmpty from '../utils/isEmpty';
import { getMangaIdFeed } from '../api/manga';
import { Includes, MangaContentRating, Order } from '../api/static';
import scheduleNotification from '../utils/scheduleNotification';
import { formatNowDistance } from '../utils/dateFns';
import getChapterTitle from '../utils/getChapterTitle';


export default function Updates() {
    const width = Dimensions.get('window').width

    const [updates = {}, setUpdates] = useMMKVObject('updates', storage)
    const [library = {}, setLibrary] = useMMKVObject('library', storage)
    const [refreshing, setRefreshing] = useState(false);

    const updateLibrary = async () => {
        const ids = {}
        const libraryCopy = { ...library }
        Object.entries(library).forEach(([key, value]) => Object.entries(value.items).forEach(([k, val]) => {
            ids[k] = ({ ...val, updatedAtSince: val.updatedAtSince || new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 19) })
            libraryCopy[key].items[k].updatedAtSince = new Date().toISOString().slice(0, 19)
        }))

        setLibrary(libraryCopy)

        const requestParams = {
            limit: 500,
            includes: [Includes.SCANLATION_GROUP, Includes.USER],
            order: { volume: Order.DESC, chapter: Order.DESC },
            contentRating: [MangaContentRating.SAFE, MangaContentRating.EROTICA, MangaContentRating.SUGGESTIVE, MangaContentRating.PORNOGRAPHIC],
            translatedLanguage: ['en']
        };

        await scheduleNotification("Fetching new updates", "fetching...")
        for (const id of Object.keys(ids)) {
            const { data } = await getMangaIdFeed(id, { ...requestParams, updatedAtSince: ids[id].updatedAtSince })
            if (data && data.data && data.data.length !== 0) {
                data.data.forEach(d => {
                    if (updates[d.attributes.updatedAt.slice(0, 10)] == undefined) {
                        updates[d.attributes.updatedAt.slice(0, 10)] = []
                    }
                    updates[d.attributes.updatedAt.slice(0, 10)].push({ manga: { ...ids[id], id }, chapter: d })
                    scheduleNotification(ids[id].title, getChapterTitle(d), { url: { pathname: `/chapter/${d.id}`, params: { mangaId: id } } });
                });
            }
        }

        setUpdates(updates)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        updateLibrary()
        setRefreshing(false)
    }, []);

    const { clearManga } = useManga()

    useFocusEffect(
        useCallback(() => {
            clearManga()
        }, [])
    );


    return (
        <ScrollView style={styles.container} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={[styles.detail, { width: width }]}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </Pressable>
                <BoldText style={{ fontSize: 20 }}>NEW UPDATES</BoldText>
            </View>
            <Pressable onPress={() => setUpdates()}><NormalText>Reset</NormalText></Pressable>
            {isEmpty(updates)
                ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 60, backgroundColor: COLORS.gray, marginBottom: 20 }}>
                    <BoldText style={{ fontSize: 16 }}>NO UPDATES</BoldText>
                </View>
                : Object.keys(updates).sort((a, b) => new Date(b) - new Date(a)).map((date, index) => {
                    return (
                        <View key={index} style={{ width: width, gap: 10, flex: 1, width: "100%" }}>
                            <SemiBoldText style={{ fontSize: 16 }}>{format(new Date(date), "dd/MM/yyyy")}</SemiBoldText>
                            <View >
                                {updates[date].map((v, idx) => {
                                    return (
                                        <Pressable key={idx} onPress={() => router.push({ pathname: `/chapter/${v.chapter.id}`, params: { mangaId: v.manga.id } })}
                                            style={{ flex: 1, height: 60, flexDirection: 'row', gap: 15, paddingVertical: 5, marginBottom: 10 }}>
                                            <Image source={{ uri: v.manga.coverArt }} style={{ width: 50, height: 50, borderRadius: 5 }} resizeMode='cover' />
                                            <View style={{ maxHeight: 60, overflow: 'hidden', justifyContent: "space-between", flex: 1 }}>
                                                <BoldText numberOfLines={1} style={{ fontSize: 16, lineHeight: 20 }}>
                                                    {v.manga.title}
                                                </BoldText>
                                                {/* <View></View> */}
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                                    <NormalText numberOfLines={1} style={{ fontSize: 12, flex: 1, flexShrink: 1 }}>
                                                        {getChapterTitle(v.chapter)}
                                                    </NormalText>
                                                    <NormalText numberOfLines={1} style={{ fontSize: 12 }}>
                                                        {formatNowDistance(new Date(v.chapter.attributes.updatedAt)) || ""}
                                                    </NormalText>
                                                </View>
                                            </View>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>
                    )
                })}
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
