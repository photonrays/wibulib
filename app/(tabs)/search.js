import { View, StyleSheet, StatusBar, Dimensions, TextInput, Pressable, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, SearchFilter, SearchResult } from '../../components';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesome6, Ionicons, Feather } from '@expo/vector-icons';
import { getMangaTag, getSearchManga } from '../../api/manga';
import { useManga } from '../../contexts/useManga';
import Card2 from '../../components/Card2';

const limit = 16
const initialOptionKeys = ["hasAvailableChapters", "availableTranslatedLanguage", "includes", "offset", "limit"]

export default function Search() {
    const win = Dimensions.get('window')
    const { clearManga } = useManga()

    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [options, setOptions] = useState({ hasAvailableChapters: 'true', availableTranslatedLanguage: ['en'], includes: ['cover_art', 'author'], offset: 0, limit })
    const [modalVisible, setModalVisible] = useState(false)
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState(null)
    const [UI, setUI] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState(1)

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

    const getData = async (type, title = null, customOptions = null) => {
        if (isLoading.current == true) return;
        if (type == "loadMore" && isStop.current == true) return;
        if (type == "refresh") {
            setSearchResult([]);
            isStop.current = false;
        }
        try {
            setUI(true);
            isLoading.current = true;

            const { data } = await getSearchManga({ ...(customOptions || options), offset: type == "loadMore" ? searchResult.length : 0, limit: limit, title: searchValue })
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

    const clearOptions = () => {
        setOptions({ hasAvailableChapters: 'true', availableTranslatedLanguage: ['en'], includes: ['cover_art', 'author'], offset: searchResult.length, limit })
        getData("refresh", null, { hasAvailableChapters: 'true', availableTranslatedLanguage: ['en'], includes: ['cover_art', 'author'], offset: searchResult.length, limit })
    }

    const renderFooterList = useMemo(() => {
        if (UI) return <ActivityIndicator size={'large'} color={COLORS.primary} />;
        if (isStop.current && searchResult.length === 0) return
        (<View style={{ width: '100%', marginTop: 20, alignItems: 'center' }}>
            <BoldText style={{ fontSize: 18 }}>No manga found</BoldText>
        </View>)
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
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable style={({ pressed }) => [styles.buttonContainer, { backgroundColor: pressed ? COLORS.gray2 : COLORS.gray }]} onPress={() => setModalVisible(true)}>
                            <Feather name="filter" size={26} color={COLORS.white} />
                        </Pressable>
                        {Object.keys(options).filter(k => !initialOptionKeys.includes(k)).length !== 0 && <Pressable
                            onPress={clearOptions}
                            style={[styles.buttonContainer, { backgroundColor: COLORS.primary, width: 120 }]}>
                            <BoldText style={{ fontSize: 16 }}>CLEAR FILTER</BoldText>
                        </Pressable>}
                    </View>

                    <View style={{ flexDirection: 'row', backgroundColor: COLORS.gray, borderRadius: 5 }}>
                        <Pressable onPress={() => setSelectedLayout(1)} style={({ pressed }) => [styles.buttonContainer, { backgroundColor: selectedLayout === 1 ? COLORS.gray2 : (pressed ? COLORS.gray2 : COLORS.gray) }]}>
                            <Feather name="list" size={30} color={COLORS.white} />
                        </Pressable>
                        <Pressable onPress={() => setSelectedLayout(2)} style={({ pressed }) => [styles.buttonContainer, { backgroundColor: selectedLayout === 2 ? COLORS.gray2 : (pressed ? COLORS.gray2 : COLORS.gray) }]}>
                            <Feather name="grid" size={30} color={COLORS.white} />
                        </Pressable>
                    </View>
                </View>


                {selectedLayout === 1 ?
                    <FlatList
                        ref={flatListRef}
                        style={{ width: '100%' }}
                        data={searchResult}
                        key={'_'}
                        keyExtractor={(item, idx) => idx + "_"}
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
                    />
                    :
                    <FlatList
                        ref={flatListRef}
                        style={{ width: '100%' }}
                        data={searchResult}
                        key={'#'}
                        keyExtractor={(item, idx) => idx + "#"}
                        renderItem={(item) => <Card2 manga={item.item} />}
                        numColumns={2}
                        contentContainerStyle={{ gap: 10 }}
                        columnWrapperStyle={{ gap: 10 }}
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
                    />}

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
