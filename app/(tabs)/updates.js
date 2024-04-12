import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, FlatList, TextInput } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, NormalText, SemiBoldText } from '../../components';
import { FontAwesome6, Ionicons, Octicons, Feather, AntDesign, Entypo } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useMMKVObject } from 'react-native-mmkv';
import { storage } from '../../store/MMKV';
import { Card2 } from '../../components';
import { useCallback, useRef, useState } from 'react';
import { useManga } from '../../contexts/useManga';
import { SelectDropdown } from '../../components/Dropdown';
import { Modal, Portal, PaperProvider } from 'react-native-paper';


export default function Updates() {
    const width = Dimensions.get('window').width

    const [updates, setUpdates] = useMMKVObject('updates', storage)

    console.log("updates: ", updates)

    const { clearManga } = useManga()

    useFocusEffect(
        useCallback(() => {
            clearManga()
        }, [])
    );


    return (
        <PaperProvider>
            <ScrollView style={styles.container}>
                <Stack.Screen options={{
                    headerShown: false
                }} />
                <View style={[styles.detail, { width: width }]}>
                    <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                        <Ionicons name="notifications-sharp" size={24} color={COLORS.white} />
                    </View>
                    <BoldText style={{ fontSize: 20 }}>NEW UPDATES</BoldText>
                </View>

                {Object.entries(updates).map(([key, value], index) => {
                    return (
                        <View key={index} style={styles.categoryItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, flexShrink: 1 }}>
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
                            {key != 0 && <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                <Pressable onPress={() => {
                                    if (selectedCategoryId == key) {
                                        setSelectedCategoryId(0)
                                        dropDownRef.current.selectIndex(0)
                                    }
                                    setLibrary(prev => {
                                        const { [key]: _, ...rest } = prev
                                        return rest
                                    })
                                }}>
                                    <Feather name="trash" size={24} color={COLORS.white} />
                                </Pressable>
                            </View>}
                        </View>
                    )
                })}
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        padding: 15
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
