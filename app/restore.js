import { View, StyleSheet, StatusBar, ScrollView, Dimensions, RefreshControl, Pressable, Image, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useMMKVObject, useMMKVString } from 'react-native-mmkv';
import { COLORS } from '../constants';
import { BoldText, NormalText, SemiBoldText } from '../components';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';
import { storage } from '../store/MMKV';
import { encode as btoa } from 'base-64'



export default function Restore() {
    const [checked, setChecked] = useState({ "library": true, "history": true, "setting": true })
    const [library = { 0: { name: 'default', items: {} } }, setLibrary] = useMMKVObject('library', storage)
    const [history = {}, setHistory] = useMMKVObject('history', storage)
    const [backupLocation, setBackupLocation] = useMMKVString('backup-location', storage)

    const backupLibraryData = async () => {
        const backup = {
            library: checked.library ? library : null,
            history: checked.history ? history : null,
            settings: checked.setting ? backupLocation : null
        }

        const formattedDate = format(new Date(), 'dd-MM-yyyy_HH-mm');

        await FileSystem.StorageAccessFramework.createFileAsync(backupLocation, `wibulib-backup-${formattedDate}.txt`, 'text/plain')
            .then(async (uri) => {
                await FileSystem.writeAsStringAsync(uri, btoa(JSON.stringify(backup)), { encoding: FileSystem.EncodingType.Base64 })
                console.log("Backup success!")
            })
            .catch(e => console.log(e));
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={styles.detail}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </Pressable>
                <BoldText style={{ fontSize: 20 }}>Create backup</BoldText>
            </View>
            <View style={{ paddingHorizontal: 5, flex: 1 }}>
                <SemiBoldText style={{ marginBottom: 5 }}>Library</SemiBoldText>
                <View style={styles.checkBoxContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Checkbox
                            value={checked.library}
                            onValueChange={() => {
                                setChecked(prev => ({ ...prev, library: !prev.library }));
                            }}
                            color={checked.library ? COLORS.primary : undefined}
                        />
                        <NormalText>Library entries</NormalText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Checkbox
                            value={checked.history}
                            onValueChange={() => {
                                setChecked(prev => ({ ...prev, history: !prev.history }));
                            }}
                            color={checked.history ? COLORS.primary : undefined}
                        />
                        <NormalText>Reading history</NormalText>
                    </View>
                </View>
                <SemiBoldText style={{ marginBottom: 5 }}>Setting</SemiBoldText>
                <View style={styles.checkBoxContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Checkbox
                            value={checked.setting}
                            onValueChange={() => {
                                setChecked(prev => ({ ...prev, setting: !prev.setting }));
                            }}
                            color={checked.setting ? COLORS.primary : undefined}
                        />
                        <NormalText>App settings</NormalText>
                    </View>
                </View>
            </View>

            <Pressable style={styles.button} onPress={backupLibraryData}>
                <NormalText>Create backup</NormalText>
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
