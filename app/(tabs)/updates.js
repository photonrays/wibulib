import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, DetailCard2, NormalText, SemiBoldText } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect } from 'expo-router';
import { useMMKVObject } from 'react-native-mmkv';
import { storage } from '../../store/MMKV';
import { useCallback } from 'react';
import { useManga } from '../../contexts/useManga';
import { PaperProvider } from 'react-native-paper';
import isEmpty from '../../utils/isEmpty';
import { format } from 'date-fns';


export default function Updates() {
    const width = Dimensions.get('window').width

    const [updates = {}, setUpdates] = useMMKVObject('updates', storage)
    const reset = () => {
        setUpdates({})
    }

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
                <Pressable onPress={reset}>
                    <NormalText>Reset</NormalText>
                </Pressable>

                {isEmpty(updates)
                    ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 60, backgroundColor: COLORS.gray, marginBottom: 20 }}>
                        <BoldText style={{ fontSize: 16 }}>NO UPDATES</BoldText>
                    </View>
                    : Object.entries(updates).map(([key, value], index) => {
                        return (
                            <View key={index} style={{ width: width, marginBottom: 20 }}>
                                <SemiBoldText style={{ fontSize: 16, marginBottom: 10 }}>{format(Date(key), "dd/MM/yyyy")}</SemiBoldText>
                                {Object.entries(value).map(([id, v], idx) => {
                                    return (
                                        <DetailCard2
                                            key={idx}
                                            chapterList={v.items}
                                            coverArt={v.coverArt}
                                            mangaId={id}
                                            mangaTitle={v.title} />
                                    )
                                })}
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
