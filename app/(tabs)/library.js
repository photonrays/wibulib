import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, NormalText } from '../../components';
import { FontAwesome6, Ionicons, Octicons, Feather, AntDesign } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useMMKVObject } from 'react-native-mmkv';
import { storage } from '../../store/MMKV';
import { Card2 } from '../../components';
import { useCallback } from 'react';
import { useManga } from '../../contexts/useManga';


export default function Library() {
    const width = Dimensions.get('window').width

    const [library = [], setLibrary] = useMMKVObject('library', storage)
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
            <View>
                <Pressable onPress={() => setLibrary([])}><NormalText>Reset library</NormalText></Pressable>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {/* {Object.entries(library).map(([key, value], index) =>
                    <Card2 key={index} id={key} cover={value.coverArt} title={value.title} />)} */}
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
    }
})
