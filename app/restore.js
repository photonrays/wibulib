import { View, StyleSheet, StatusBar, Pressable, ToastAndroid } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useMMKVObject, useMMKVString } from 'react-native-mmkv';
import { COLORS } from '../constants';
import { BoldText, NormalText, SemiBoldText } from '../components';
import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { decode } from 'base-64'
import { storage } from '../store/MMKV';


export default function Restore() {
    const [checked, setChecked] = useState({ "library": true, "history": true, "settings": true })
    const [library, setLibrary] = useMMKVObject('library', storage)
    const [history, setHistory] = useMMKVObject('history', storage)
    const [backupLocation, setBackupLocation] = useMMKVString('backup-location', storage)
    const [data, setData] = useState()

    const selectBackup = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true
        });

        if (!result.canceled) {
            const base64 = await FileSystem.readAsStringAsync(
                result.assets[0].uri,
                {
                    encoding: FileSystem.EncodingType.Base64
                }
            );

            if (base64) {
                setData(JSON.parse(decode(base64)))
            }
        }
    }

    useEffect(() => {
        selectBackup()
    }, [])

    const restoreLibraryData = async () => {
        if (selectBackup) {
            if (checked.library) {
                setLibrary(data.library)
            }
            if (checked.history) {
                setHistory(data.history)
            }
            if (checked.settings) {
                setBackupLocation(data.settings)
            }
        }
        ToastAndroid.show(
            'Restore success!',
            ToastAndroid.SHORT
        );
        router.back()
    }


    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={styles.detail}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </Pressable>
                <BoldText style={{ fontSize: 20 }}>Restore backup</BoldText>
            </View>
            <View style={{ paddingHorizontal: 5, flex: 1 }}>
                <SemiBoldText style={{ marginBottom: 5 }}>Library</SemiBoldText>
                <View style={styles.checkBoxContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {data?.library && <>
                            <Checkbox
                                value={checked.library}
                                onValueChange={() => {
                                    setChecked(prev => ({ ...prev, library: !prev.library }));
                                }}
                                color={checked.library ? COLORS.primary : undefined}
                            />
                            <NormalText>Library entries</NormalText>
                        </>}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {data?.history && <>
                            <Checkbox
                                value={checked.history}
                                onValueChange={() => {
                                    setChecked(prev => ({ ...prev, history: !prev.history }));
                                }}
                                color={checked.history ? COLORS.primary : undefined}
                            />
                            <NormalText>Reading history</NormalText>
                        </>}
                    </View>
                </View>
                <SemiBoldText style={{ marginBottom: 5 }}>Setting</SemiBoldText>
                <View style={styles.checkBoxContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {data?.settings && <>
                            <Checkbox
                                value={checked.settings}
                                onValueChange={() => {
                                    setChecked(prev => ({ ...prev, settings: !prev.settings }));
                                }}
                                color={checked.settings ? COLORS.primary : undefined}
                            />
                            <NormalText>App settings</NormalText>
                        </>}
                    </View>
                </View>
            </View>

            <Pressable style={styles.button} onPress={restoreLibraryData}>
                <NormalText>Restore backup</NormalText>
            </Pressable>
        </View>
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
        marginBottom: 10,
        width: '100%'
    },
    checkBoxContainer: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: COLORS.gray,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 15,
        gap: 20
    },
    button: {
        width: '100%',
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        marginBottom: 10
    }
})
