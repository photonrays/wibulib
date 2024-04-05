import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, TextInput, Pressable, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, NormalText, SearchFilter, SearchResult } from '../../components';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesome6, Ionicons, Octicons, Feather, AntDesign } from '@expo/vector-icons';
import { getMangaTag, getSearchManga } from '../../api/manga';
import { useManga } from '../../contexts/useManga';

const limit = 16

export default function Search() {
    const win = Dimensions.get('window')
    const { title } = useLocalSearchParams()
    const { clearManga } = useManga()

    const [searchValue, setSearchValue] = useState(title || '')
    const [searchResult, setSearchResult] = useState([])
    const [options, setOptions] = useState({ hasAvailableChapters: 'true', availableTranslatedLanguage: ['vi'], includes: ['cover_art', 'author'] })
    const [modalVisible, setModalVisible] = useState(false)
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState(null)
    const [UI, setUI] = useState(false);

    const flatListRef = useRef(null)
    const isStop = useRef(false);
    const isLoading = useRef(false);

    useFocusEffect(
        useCallback(() => {
            clearManga()
        }, [])
    );

    useEffect(() => {
        getMangaTag()
            .then((data) => {
                data.data.data.sort(function (a, b) {
                    if (a.attributes.name.en < b.attributes.name.en) {
                        return -1;
                    }
                    if (a.attributes.name.en > b.attributes.name.en) {
                        return 1;
                    }
                    return 0;
                });
                setTags(data.data.data)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    useEffect(() => {
        if (options?.includedTags) {
            setSelectedTags(tags.filter((t) => options.includedTags.includes(t.id)))
        } else {
            setSelectedTags(null)
        }
    }, [options])

    const getData = async (type) => {
        if (isLoading.current == true) return;
        if (type == "loadMore" && isStop.current == true) return;
        if (type == "refresh") {
            setSearchResult([]);
            isStop.current = false;
        }
        try {
            setUI(true);
            isLoading.current = true;

            const { data } = await getSearchManga({ ...options, offset: type == "loadMore" ? searchResult.length : 0, limit: limit, title: searchValue })
            await new Promise((resolve) => setTimeout(resolve, 500));
            isLoading.current = false;
            if (data.data.length < limit) {
                isStop.current = true;
            }
            setSearchResult(prev => {
                if (type == "refresh") return data?.data
                else if (type == "loadMore") return [...prev, ...data?.data]
            });
        } catch (error) {
            console.log(error);
        } finally {
            setUI(false);
        }
    };

    const renderFooterList = useMemo(() => {
        if (UI) return <ActivityIndicator size={'large'} color={COLORS.primary} />;
        if (isStop.current) return <BoldText style={{ fontSize: 18 }}>End of list</BoldText>;
        return <View />;
    }, [UI]);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <StatusBar backgroundColor={'transparent'} />

            <SearchFilter isVisible={modalVisible} options={options} setOptions={setOptions} setIsVisible={setModalVisible} tags={tags} selectedTags={selectedTags} />

            <View style={{ flex: 1, gap: 15, paddingHorizontal: 15 }}>
                <View style={[styles.titleContainer, { width: win.width }]}>
                    <BoldText style={{ fontSize: 20, }}>ADVANCED SEARCH</BoldText>
                </View>

                <View
                    style={[{
                        backgroundColor: COLORS.gray,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10
                    }]}>
                    <View style={{ marginRight: 10, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome6 name="magnifying-glass" size={24} color={COLORS.white} />
                    </View>
                    <TextInput
                        inputMode='text'
                        style={{ flex: 1, color: COLORS.white, fontFamily: 'Poppins_400Regular', fontSize: 16 }}
                        placeholderTextColor={COLORS.white} placeholder='Enter a search query...'
                        onChangeText={newText => setSearchValue(newText)}
                        defaultValue={searchValue}
                        onSubmitEditing={() => getData("refresh")}
                    />
                    {searchValue !== '' && <Pressable onPress={() => setSearchValue('')}
                        style={{
                            backgroundColor: COLORS.primary,
                            width: 35,
                            height: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5
                        }}>
                        <Ionicons name="close" size={30} color={COLORS.white} />
                    </Pressable>}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable style={({ pressed }) => [styles.buttonContainer, { backgroundColor: pressed ? COLORS.gray2 : COLORS.gray }]} onPress={() => setModalVisible(true)}>
                        <Feather name="filter" size={26} color={COLORS.white} />
                    </Pressable>

                    <View style={{ flexDirection: 'row', backgroundColor: COLORS.gray, borderRadius: 5 }}>
                        <Pressable style={({ pressed }) => [styles.buttonContainer, { backgroundColor: pressed ? COLORS.gray2 : COLORS.gray }]}>
                            <Feather name="list" size={30} color={COLORS.white} />
                        </Pressable>
                        <Pressable style={({ pressed }) => [styles.buttonContainer, { backgroundColor: pressed ? COLORS.gray2 : COLORS.gray }]}>
                            <Octicons name="rows" size={26} color={COLORS.white} />
                        </Pressable>
                        <Pressable style={({ pressed }) => [styles.buttonContainer, { backgroundColor: pressed ? COLORS.gray2 : COLORS.gray }]}>
                            <Feather name="grid" size={30} color={COLORS.white} />
                        </Pressable>
                    </View>
                </View>

                {searchResult.length !== 0 ?
                    <FlatList
                        ref={flatListRef}
                        style={{ width: '100%' }}
                        data={searchResult}
                        keyExtractor={(item, idx) => idx + ""}
                        renderItem={(item) => <SearchResult manga={item.item} />}
                        onEndReached={() => getData("loadMore")}
                        onEndReachedThreshold={0.3}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={() => getData("refresh")}
                            />
                        }
                        ListFooterComponent={
                            <View style={{ alignItems: "center", marginVertical: 10 }}>
                                {renderFooterList}
                            </View>
                        }
                    /> :
                    <View style={{ width: '100%', marginTop: 20, alignItems: 'center' }}>
                        <BoldText style={{ fontSize: 18 }}>No manga found</BoldText>
                    </View>
                }

            </View>
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
    }
})
