import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, TextInput, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, NormalText, SearchFilter, SearchResult } from '../../components';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FontAwesome6, Ionicons, Octicons, Feather, AntDesign } from '@expo/vector-icons';
import { getMangaTag, getSearchManga } from '../../api/manga';


export default function Search() {
    const win = Dimensions.get('window')
    const { title } = useLocalSearchParams()
    const [searchValue, setSearchValue] = useState(title || '')
    const [searchResult, setSearchResult] = useState([])
    const [options, setOptions] = useState({ hasAvailableChapters: 'true', availableTranslatedLanguage: ['vi'], includes: ['cover_art', 'author'] })
    const [modalVisible, setModalVisible] = useState(false)
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState(null)
    const [page, setPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [totalManga, setTotalManga] = useState(0)

    const flatListRef = useRef(null)

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

    const searchManga = async () => {
        setIsLoading(true)
        try {
            const { data } = await getSearchManga({ ...options, offset: page * 16, limit: 16, title: searchValue })
            if (data && data.data) {
                setSearchResult(prev => {
                    if (page === 0) return data.data
                    return [...prev, ...data.data]
                })
                setTotalManga(data.total)
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = () => {
        if (page == 0) {
            searchManga()
        } else setPage(0)
        flatListRef?.current?.scrollToOffset({ animated: false, offset: 0 });
    }

    useEffect(() => {
        if (options?.includedTags) {
            setSelectedTags(tags.filter((t) => options.includedTags.includes(t.id)))
        } else {
            setSelectedTags(null)
        }
    }, [options])

    const renderLoader = () => {
        return (
            isLoading ?
                <View>
                    <ActivityIndicator size={'large'} color={COLORS.white} />
                </View> : null
        )
    }
    const loadMoreItem = () => {
        if (searchResult.length < totalManga) {
            setPage(page + 1)
        }
    }

    useEffect(() => {
        searchManga()
    }, [page])

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
                        // onFocus={() => setFocus(true)}
                        onChangeText={newText => setSearchValue(newText)}
                        defaultValue={searchValue}
                        onSubmitEditing={handleSubmit}
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
                        keyExtractor={(item) => item.id}
                        renderItem={(item) => <SearchResult manga={item.item} />}
                        ListFooterComponent={renderLoader}
                        onEndReached={loadMoreItem}
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
