import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import { COLORS } from '../constants';
import { FontAwesome5, Ionicons, AntDesign, Feather, Entypo, FontAwesome } from '@expo/vector-icons';
import { BoldText } from './BoldText';
import { RadioButton } from 'react-native-paper';


export default function BookmarkModal({ type, isVisible, setIsVisible, id, coverArt, title, library, setLibrary }) {
    const win = Dimensions.get('window')
    const [checked, setChecked] = useState(0);
    const [previousId, setPreviousId] = useState(0)

    const modalShow = () => {
        if (type == 'edit') {
            Object.entries(library).forEach(([key, value]) => {
                if (value.items[id]) {
                    setChecked(key)
                    setPreviousId(key)
                }
            })
        }
    }

    const deleteCategory = (key) => {
        if (checked == key) {
            setChecked(0)
        }

        setLibrary(prev => {
            const { [key]: _, ...rest } = prev
            return rest
        })
    }

    const addBookmark = () => {
        setLibrary(prev => ({
            ...prev,
            [checked]: {
                ...prev?.[checked],
                items: {
                    ...prev?.[checked].items,
                    [id]: {
                        title,
                        coverArt,
                        updatedAtSince: new Date().toISOString().slice(0, 19)
                    },
                },
            },
        }))
    }

    const updateBookmark = () => {
        if (checked !== previousId) {
            const libraryCopy = { ...library }
            delete libraryCopy[previousId].items[id]

            setLibrary({
                ...libraryCopy,
                [checked]: {
                    ...libraryCopy?.[checked],
                    items: {
                        ...libraryCopy?.[checked].items,
                        [id]: {
                            title,
                            coverArt,
                        },
                    },
                },
            })
        }
    }

    const removeBookmark = () => {
        const libraryCopy = { ...library }
        delete libraryCopy[previousId].items[id]

        setLibrary(libraryCopy)
    }

    return (
        <Modal
            onModalShow={modalShow}
            isVisible={isVisible}
            style={{ width: win.width, height: win.height, backgroundColor: COLORS.gray, margin: 0 }}
            animationIn={'slideInLeft'}
            animationOut={'slideOutLeft'}
        >
            <ScrollView contentContainerStyle={{ padding: 15, gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BoldText style={{ fontSize: 20, }}>{type == 'add' ? 'Add To Library' : 'Edit Bookmark'}</BoldText>
                    <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => setIsVisible(false)}>
                        <Ionicons name="close" size={30} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Image source={{ uri: coverArt }} style={styles.cover} />
                    <BoldText numberOfLines={3} style={{ fontSize: 20, flex: 1 }}>{title}</BoldText>
                </View>

                <View style={{ gap: 10 }}>
                    <BoldText style={{ fontSize: 16 }}>Select Category</BoldText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ flex: 1, gap: 10 }}>
                            {Object.entries(library).map(([key, value], index) => {
                                return (
                                    <View key={index} style={styles.categoryItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, flexShrink: 1 }}>
                                            <RadioButton
                                                status={checked == key ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked(key)}
                                            />
                                            <View style={{ padding: 5, flex: 1 }}>
                                                <TextInput
                                                    value={value.name}
                                                    style={{ color: COLORS.white, flex: 1 }}
                                                    onChangeText={newText => setLibrary(prev => ({
                                                        ...prev,
                                                        [key]: {
                                                            ...prev?.[key],
                                                            name: newText
                                                        },
                                                    }))}
                                                    editable={key != 0}
                                                />
                                            </View>
                                        </View>
                                        {key != 0 && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                            <Pressable onPress={() => deleteCategory(key)}>
                                                <Feather name="trash" size={24} color={COLORS.white} />
                                            </Pressable>
                                        </View>}
                                    </View>
                                )
                            })}

                            <Pressable
                                onPress={() => {
                                    setLibrary(prev => ({ ...prev, [Math.random().toString(16).slice(2)]: { name: 'New Category', items: {} } }))
                                }}
                                style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}>
                                <Entypo name="plus" size={24} color={COLORS.white} />
                                <BoldText style={{ fontSize: 16 }}>Add Category</BoldText>
                            </Pressable>
                        </View>

                    </View>
                </View>
                {type == 'add' ? <Pressable
                    onPress={() => {
                        addBookmark()
                        setIsVisible(false)
                    }}
                    style={({ pressed }) => [styles.button, { backgroundColor: COLORS.primary, opacity: pressed ? 0.7 : 1 }]}>
                    <BoldText style={{ fontSize: 16 }}>{type == 'add' ? 'Add' : 'Update'}</BoldText>
                </Pressable>
                    : <View style={{ gap: 10 }}>
                        <Pressable
                            onPress={() => {
                                updateBookmark()
                                setIsVisible(false)
                            }}
                            style={({ pressed }) => [styles.button, { backgroundColor: COLORS.primary, opacity: pressed ? 0.7 : 1 }]}>
                            <BoldText style={{ fontSize: 16 }}>{type == 'add' ? 'Add' : 'Update'}</BoldText>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                removeBookmark()
                                setIsVisible(false)
                            }}
                            style={({ pressed }) => [styles.button, { backgroundColor: 'red', opacity: pressed ? 0.7 : 1 }]}>
                            <BoldText style={{ fontSize: 16 }}>Remove</BoldText>
                        </Pressable>
                    </View>}
                <Pressable
                    onPress={() => setIsVisible(false)}
                    style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}>
                    <BoldText style={{ fontSize: 16 }}>Cancel</BoldText>
                </Pressable>
            </ScrollView>
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
