import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { COLORS } from '../constants';
import { BoldText, NormalText, SemiBoldText } from '../components';
import { storage } from '../store/MMKV';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';
import { encode as btoa } from 'base-64'
import { useMMKVObject, useMMKVString } from 'react-native-mmkv';
import { useEffect } from 'react';


export default function Storage() {
    const width = Dimensions.get('window').width
    const [backupLocation, setBackupLocation] = useMMKVString('backup-location', storage)
    const [library, setLibrary] = useMMKVObject('library', storage)

    const setStorageLocation = async () => {
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                setBackupLocation(permissions.directoryUri)
            } else
                return;

        }
    }

    const backupLibraryData = async () => {
        if (Platform.OS === "android") {
            if (!backupLocation || backupLocation === '') {
                const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                    setBackupLocation(permissions.directoryUri)
                } else
                    return;
            }

            const data = storage.getString('library'); // Get data for key 'library'

            if (!data) {
                console.warn("Key 'library' not found in MMKV storage");
                return;
            }

            const formattedDate = format(new Date(), 'dd-MM-yyyy');

            await FileSystem.StorageAccessFramework.createFileAsync(backupLocation, `wibulib-backup-${formattedDate}.txt`, 'text/plain')
                .then(async (uri) => {
                    await FileSystem.writeAsStringAsync(uri, btoa(data), { encoding: FileSystem.EncodingType.Base64 })
                    console.log("Backup success!")
                })
                .catch(e => console.log(e));

        }
    };

    const restoreLibraryData = () => {

    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={[styles.detail, { width: width }]}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </Pressable>
                <BoldText style={{ fontSize: 20 }}>Data and storage</BoldText>
            </View>

            <View style={{ gap: 10 }}>
                <Pressable onPress={setStorageLocation} style={{ marginBottom: 10 }}>
                    <SemiBoldText style={{ fontSize: 16 }}>Storage location</SemiBoldText>
                    <NormalText>{backupLocation || "Not set"}</NormalText>
                </Pressable>

                <View style={{ gap: 10 }}>
                    <SemiBoldText>Backup and Restore</SemiBoldText>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <Pressable onPress={backupLibraryData} style={[styles.button, { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }]}>
                            <NormalText>Create backup</NormalText>
                        </Pressable>
                        <Pressable onPress={restoreLibraryData} style={[styles.button, { borderTopRightRadius: 20, borderBottomRightRadius: 20 }]}>
                            <NormalText>Restore backup</NormalText>
                        </Pressable>
                    </View>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        padding: 15,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingTop: StatusBar.currentHeight,
    },
    button: {
        paddingVertical: 15,
        backgroundColor: COLORS.gray,
        flex: 1,
        alignItems: 'center'
    }
})
