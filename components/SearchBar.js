import React, { useState } from 'react'
import { View, TextInput, Pressable, Dimensions, StatusBar, StyleSheet } from 'react-native'
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function SearchBar({ }) {
    const [searchBarOpen, setSearchBarOpen] = useState(false)
    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height

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

    return (
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
                <TextInput style={{ flex: 1, color: COLORS.white, fontFamily: 'Poppins_400Regular' }} placeholderTextColor={COLORS.white} placeholder='Enter a search query...' />
            </Animated.View>

            <Pressable style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                setSearchBarOpen(!searchBarOpen)
                if (animation.value == 1) {
                    animation.value = 0
                } else {
                    animation.value = 1
                }
            }}>
                {!searchBarOpen
                    ? <FontAwesome6 name="magnifying-glass" size={24} color={COLORS.white} />
                    : <Ionicons name="close" size={30} color={COLORS.white} />}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 2,

    }
})
