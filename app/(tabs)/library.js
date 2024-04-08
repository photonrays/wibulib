import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, FlatList } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, NormalText } from '../../components';
import { FontAwesome6, Ionicons, Octicons, Feather, AntDesign } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useMMKVObject } from 'react-native-mmkv';
import { storage } from '../../store/MMKV';
import { Card2 } from '../../components';
import { useCallback, useState } from 'react';
import { useManga } from '../../contexts/useManga';


export default function Library() {
    const width = Dimensions.get('window').width

    const [library, setLibrary] = useMMKVObject('library', storage)
    const [selectedCategoryId, setSelectedCategoryId] = useState(0)

    const { clearManga } = useManga()

    useFocusEffect(
        useCallback(() => {
            clearManga()
        }, [])
    );


    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />

            <View style={[styles.detail, { width: width }]}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </Pressable>
                <BoldText style={{ fontSize: 20 }}>LIBRARY</BoldText>
            </View>
            {/* <View>
                <Pressable onPress={() => setLibrary({ 0: { name: 'default', items: {} } })}><NormalText>Reset library</NormalText></Pressable>
            </View> */}
            <ScrollView horizontal bounces={false} contentContainerStyle={styles.buttonContainer}>
                {Object.entries(library).map(([key, value], index) => (
                    <Pressable
                        key={index}
                        style={({ pressed }) => [styles.button, { backgroundColor: selectedCategoryId == key ? COLORS.primary : COLORS.gray2, opacity: pressed ? 0.7 : 1 }]}
                        onPress={() => setSelectedCategoryId(key)}
                    >
                        <NormalText style={{ fontSize: 16 }}>{value.name}</NormalText>
                    </Pressable>))}
            </ScrollView>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 }}>
                {Object.entries(library[selectedCategoryId].items).map(([key, value], index) =>
                    <Card2 key={index} id={key} cover={value.coverArt} title={value.title} />)}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        padding: 15
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingTop: StatusBar.currentHeight,
    },
    buttonContainer: {
        gap: 10,
        backgroundColor: COLORS.gray,
        marginBottom: 15
    },
    button: {
        backgroundColor: COLORS.gray2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    }
})
