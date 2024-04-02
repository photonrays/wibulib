import React, { useEffect, useRef, useState } from 'react'
import { View, TextInput, Pressable, Dimensions, StatusBar, StyleSheet, Image } from 'react-native'
import { FontAwesome6, Ionicons, AntDesign } from '@expo/vector-icons';
import { COLORS, images } from '../constants';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import useSearchManga from '../hooks/useSearchManga';
import { getSearchManga } from '../api/manga';
import { Link, router } from 'expo-router';
import { NormalText } from './NormalText';
import { SemiBoldText } from './SemiBoldText';
import SearchResult from './SearchResult';
import { ScrollView } from 'react-native-gesture-handler';

export default function SearchBar({ }) {
    const [searchBarOpen, setSearchBarOpen] = useState(false)
    const [focus, setFocus] = useState(false)
    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height
    const inputRef = useRef(null)
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([])


    const animation = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: animation.value == 1
                ? withTiming(width * 0.8, { duration: 120 })
                : withTiming(0, { duration: 120 }),
            padding: animation.value == 1
                ? withTiming(10, { duration: 120 })
                : withTiming(0, { duration: 120 })
        }
    })

    const handlePress = () => {
        setSearchBarOpen(!searchBarOpen)
        if (animation.value == 1) {
            setFocus(false)
            animation.value = 0
        } else {
            setFocus(true)
            animation.value = 1
        }
    }

    useEffect(() => {
        if (focus) {
            setTimeout(() => {
                inputRef.current?.blur();
                inputRef.current?.focus();
            }, 100);
        } else {
            inputRef.current?.blur()
        }
    }, [focus])

    useEffect(() => {
        if (searchValue.length <= 0) {
            setSearchResult([])
        }
        const delayDebounceFn = setTimeout(() => {
            if (searchValue.length > 0) {
                getSearchManga({ title: searchValue, hasAvailableChapters: 'true', availableTranslatedLanguage: ['vi'], includes: ['cover_art', 'author'] })
                    .then(data => setSearchResult(data.data?.data))
                    .catch(e => console.log(e))
            }
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [searchValue])

    return (
        <>
            {focus && <Pressable onPress={() => setFocus(false)} style={{ width: width, height: 5000, backgroundColor: 'rgba(0,0,0,0.7)', position: 'absolute' }}></Pressable>}
            <View style={[styles.container, { width: width }]}>
                <Animated.View
                    style={[{
                        backgroundColor: COLORS.gray,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 10,
                    },
                        animatedStyle]}>
                    <TextInput
                        ref={inputRef}
                        inputMode='text'
                        style={{ flex: 1, color: COLORS.white, fontFamily: 'Poppins_400Regular' }}
                        placeholderTextColor={COLORS.white} placeholder='Enter a search query...'
                        onFocus={() => setFocus(true)}
                        onChangeText={newText => setSearchValue(newText)}
                        defaultValue={searchValue}
                    />
                </Animated.View>

                <Pressable style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={handlePress}>
                    {!searchBarOpen
                        ? <FontAwesome6 name="magnifying-glass" size={24} color={COLORS.white} />
                        : <Ionicons name="close" size={30} color={COLORS.white} />}
                </Pressable>

                {focus && <View style={[styles.searchResult, { width: width, height: height }]}>
                    {searchResult.length !== 0 &&
                        <ScrollView style={{ width: '100%' }}>
                            <Pressable onPress={() => router.navigate({ pathname: `/search`, params: { title: searchValue } })} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }} >
                                <NormalText style={{ fontSize: 18 }}>Advanced search</NormalText>
                                <AntDesign name="arrowright" size={24} color={COLORS.white} />
                            </Pressable>
                            {searchResult.map((manga, index) => <SearchResult key={index} manga={manga} />)}
                        </ScrollView>
                    }
                </View>}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 2,
        position: 'relative'
    },
    searchResult: {
        position: 'absolute',
        minHeight: 100,
        backgroundColor: COLORS.black,
        top: '110%',
        right: -15,
        padding: 15,
        paddingHorizontal: 20, borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        pointerEvents: 'box-none',
        zIndex: 100
    },
    imageContainer: {
        flex: 1,
        maxWidth: 60,
        borderRadius: 5,
        backgroundColor: 'red'
    },
    image: {
        flex: 1,
        maxHeight: '100%',
        maxWidth: '100%',
        resizeMode: 'cover',
        borderRadius: 5
    },
    flexBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    }
})
