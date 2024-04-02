import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, TextInput, Pressable, FlatList } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, NormalText, SearchResult } from '../../components';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FontAwesome6, Ionicons, Octicons, Feather, AntDesign } from '@expo/vector-icons';
import { getSearchManga } from '../../api/manga';


export default function Search() {
    const win = Dimensions.get('window')
    const { title } = useLocalSearchParams()
    const [searchValue, setSearchValue] = useState(title || '')
    const [searchResult, setSearchResult] = useState([])
    const [options, setOptions] = useState({ hasAvailableChapters: 'true', availableTranslatedLanguage: ['vi'], includes: ['cover_art', 'author'] })

    useEffect(() => {
        if (searchValue.length <= 0) {
            setSearchResult([])
        }
        const delayDebounceFn = setTimeout(() => {
            if (searchValue.length > 0) {
                getSearchManga({ ...options, title: searchValue })
                    .then(data => setSearchResult(data.data?.data))
                    .catch(e => console.log(e))
            }
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [searchValue])

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <StatusBar backgroundColor={'transparent'} />
            <View style={{ flex: 1, gap: 15 }}>
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
                    <Pressable style={[styles.buttonContainer, { backgroundColor: COLORS.gray2 }]}>
                        <Feather name="filter" size={26} color={COLORS.white} />
                    </Pressable>

                    <View style={{ flexDirection: 'row', backgroundColor: COLORS.gray, borderRadius: 5 }}>
                        <Pressable style={[styles.buttonContainer, { backgroundColor: COLORS.gray }]}>
                            <Feather name="list" size={30} color={COLORS.white} />
                        </Pressable>
                        <Pressable style={[styles.buttonContainer, { backgroundColor: COLORS.gray }]}>
                            <Octicons name="rows" size={26} color={COLORS.white} />
                        </Pressable>
                        <Pressable style={[styles.buttonContainer, { backgroundColor: COLORS.gray2 }]}>
                            <Feather name="grid" size={30} color={COLORS.white} />
                        </Pressable>
                    </View>
                </View>

                {searchResult.length !== 0 &&
                    <ScrollView style={{ width: '100%' }}>
                        {searchResult.map((manga, index) => <SearchResult key={index} manga={manga} />)}
                    </ScrollView>
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
        paddingHorizontal: 15
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
