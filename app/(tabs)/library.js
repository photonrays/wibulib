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


const EditCategoryModal = ({ visible, setVisible, library, setLibrary, selectedCategoryId, setSelectedCategoryId, dropDownRef }) => {
    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height

    return (
        <Portal>
            <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={[styles.modalContainer, { width: width * 0.9 }]}>
                <ScrollView style={{ maxHeight: height * 0.7 }}>
                    <SemiBoldText style={{ fontSize: 16, marginBottom: 10 }}>Edit Categories</SemiBoldText>
                    {Object.entries(library).map(([key, value], index) => {
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
                    <View style={{ gap: 10 }}>
                        <Pressable
                            onPress={() => {
                                setLibrary(prev => ({ ...prev, [Math.random().toString(16).slice(2)]: { name: 'New Category', items: {} } }))
                            }}
                            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1, backgroundColor: COLORS.primary }]}>
                            <Entypo name="plus" size={24} color={COLORS.white} />
                            <BoldText style={{ fontSize: 16 }}>Add Category</BoldText>
                        </Pressable>
                        <Pressable
                            onPress={() => { setVisible(false) }}
                            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}>
                            <BoldText style={{ fontSize: 16 }}>Cancel</BoldText>
                        </Pressable>
                    </View>
                </ScrollView>
            </Modal>
        </Portal>
    )
}

export default function Library() {
    const width = Dimensions.get('window').width

    const [library, setLibrary] = useMMKVObject('library', storage)
    const [selectedCategoryId, setSelectedCategoryId] = useState(0)

    const [visible, setVisible] = useState(false);
    const dropDownRef = useRef(null)

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
                <EditCategoryModal
                    visible={visible}
                    setVisible={setVisible}
                    dropDownRef={dropDownRef}
                    library={library}
                    setLibrary={setLibrary}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                />
                <View style={[styles.detail, { width: width }]}>
                    <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                        <Ionicons name="library" size={24} color={COLORS.white} />
                    </View>
                    <BoldText style={{ fontSize: 20 }}>LIBRARY</BoldText>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <SemiBoldText style={{ fontSize: 16, marginBottom: 5 }}>Category</SemiBoldText>
                        <Pressable onPress={() => setVisible(true)}
                            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                            <Feather name="edit" size={24} color={COLORS.white} />
                        </Pressable>
                    </View>
                    <SelectDropdown
                        ref={dropDownRef}
                        data={Object.keys(library)}
                        defaultValue={0}
                        onSelect={(selectedItem) => {
                            setSelectedCategoryId(selectedItem)
                        }}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={[styles.dropdownButtonStyle]}>
                                    <NormalText numberOfLines={1}>{library[selectedItem]?.name || 'None'}</NormalText>
                                    <AntDesign name={isOpened ? "caretup" : "caretdown"} size={18} color={COLORS.white} />
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View key={index} style={{ ...styles.dropdownItemStyle }}>
                                    <NormalText style={{ ...(isSelected && { color: COLORS.primary }) }}>{library[item]?.name}</NormalText>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                    />
                </View>

                <SemiBoldText style={{ fontSize: 16, marginBottom: 5 }}>
                    {Object.keys(library[selectedCategoryId]?.items).length == 0 ? 'No Titles'
                        : (Object.keys(library[selectedCategoryId]?.items).length == 1 ? '1 Title'
                            : `${Object.keys(library[selectedCategoryId]?.items).length} Titles`)}
                </SemiBoldText>
                {Object.keys(library[selectedCategoryId]?.items).length !== 0 ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 }}>
                    {Object.entries(library[selectedCategoryId]?.items).map(([key, value], index) =>
                        <Card2 key={index} id={key} cover={value.coverArt} title={value.title} />)}
                </View>
                    : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 60, backgroundColor: COLORS.gray, marginBottom: 20 }}>
                        <BoldText style={{ fontSize: 16 }}>NO TITLES</BoldText>
                    </View>}
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
