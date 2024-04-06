import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Pressable, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import { NormalText } from './NormalText';
import { COLORS } from '../constants';
import { FontAwesome5, Ionicons, AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { BoldText } from './BoldText';
import { SelectDropdown } from './Dropdown';
import { router } from 'expo-router'


export default function BookmarkModal({ isVisible, setIsVisible, id, coverArt, title, library }) {
    const win = Dimensions.get('window')
    const categoryList = library.map(o => o.name)

    if (!categoryList.includes('default')) {
        categoryList.push('default')
    }

    return (
        <Modal
            isVisible={isVisible}
            style={{ width: win.width, height: win.height, backgroundColor: COLORS.gray, margin: 0 }}
            animationIn={'slideInLeft'}
            animationOut={'slideOutLeft'}
        >
            <View style={{ flex: 1, padding: 15, gap: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BoldText style={{ fontSize: 20, }}>Add To Library</BoldText>
                    <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => setIsVisible(false)}>
                        <Ionicons name="close" size={30} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Image source={{ uri: coverArt }} style={styles.cover} />
                    <BoldText style={{ fontSize: 20 }}>{title}</BoldText>
                </View>

                <View style={{ gap: 10 }}>
                    <BoldText style={{ fontSize: 16 }}>Select Category</BoldText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <SelectDropdown
                            data={categoryList}
                            defaultValue={'default'}
                            onSelect={(selectedItem, index) => {
                                // if (selectedItem.length !== 0) {
                                //     if (multiSelect) {
                                //         setValue(prev => ({ ...prev, [queryKey]: selectedItem.map(obj => obj.value) }))
                                //     } else {
                                //         setValue(prev => ({ ...prev, [queryKey]: selectedItem.value }))
                                //     }
                                // } else {
                                //     removeKey(queryKey)
                                // }
                            }}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View style={[styles.dropdownButtonStyle]}>
                                        <NormalText numberOfLines={1}>{selectedItem || 'None'}</NormalText>
                                        <AntDesign name={isOpened ? "caretup" : "caretdown"} size={18} color={COLORS.white} />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View key={index} style={{ ...styles.dropdownItemStyle }}>
                                        <NormalText style={{ ...(isSelected && { color: COLORS.primary }) }}>{item}</NormalText>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle}
                        />
                        <Pressable
                            // onPress={() => setCategoryVisible(true)}
                            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1, width: '20%' }]}><BoldText style={{ fontSize: 16 }}>Edit</BoldText></Pressable>
                    </View>
                </View>
                <Pressable style={({ pressed }) => [styles.button, { backgroundColor: COLORS.primary, opacity: pressed ? 0.7 : 1 }]}><BoldText style={{ fontSize: 16 }}>Add</BoldText></Pressable>
                <Pressable
                    onPress={() => setIsVisible(false)}
                    style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}>
                    <BoldText style={{ fontSize: 16 }}>Cancel</BoldText>
                </Pressable>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    cover: {
        width: 70,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    dropdownButtonStyle: {
        flex: 1,
        height: 50,
        backgroundColor: COLORS.gray2,
        borderRadius: 5,
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
    button: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.gray2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    categoryItem: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.gray2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        paddingHorizontal: 10
    }
});
