import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, Platform, ToastAndroid } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { COLORS } from '../constants';
import { BoldText, NormalText, SemiBoldText } from '../components';
import { storage } from '../store/MMKV';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base-64'
import { useMMKVObject, useMMKVString } from 'react-native-mmkv';
import * as DocumentPicker from 'expo-document-picker';

export default function Storage() {
    const width = Dimensions.get('window').width
    const [backupLocation, setBackupLocation] = useMMKVString('backup-location', storage)
    const [library, setLibrary] = useMMKVObject('library', storage)
    const [history, setHistory] = useMMKVObject('history', storage)

    const setStorageLocation = async () => {
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                setBackupLocation(permissions.directoryUri)
            } else
                return;

        }
    }

    const navigateToBackup = async () => {
        if (backupLocation) {
            router.push('/backup')
        } else {
            ToastAndroid.show(
                'Please select storage location first',
                ToastAndroid.SHORT
            );
        }
    };

    const restoreLibraryData = async () => {
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
                const data = JSON.parse(decode(base64))

                if (data.library) {
                    setLibrary(data.library)
                }
                if (data.history) {
                    setHistory(data.history)
                }
            }
        }
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

            <Pressable onPress={() => setBackupLocation()}><NormalText>Reset</NormalText></Pressable>

            <View style={{ gap: 20 }}>
                <View style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                    <SemiBoldText style={{ marginBottom: 10 }}>Storage location</SemiBoldText>
                    <Pressable
                        onPress={setStorageLocation}
                        style={({ pressed }) => [
                            styles.storageButton,
                            {
                                backgroundColor: !backupLocation ? COLORS.primary : COLORS.black,
                                opacity: pressed ? 0.7 : 1
                            }]}>
                        <NormalText>{backupLocation || "Select storage location"}</NormalText>
                    </Pressable>
                </View>

                <View style={{ gap: 10 }}>
                    <SemiBoldText>Backup and Restore</SemiBoldText>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <Pressable
                            onPress={navigateToBackup}
                            style={({ pressed }) => [styles.button, { borderTopLeftRadius: 20, borderBottomLeftRadius: 20, opacity: pressed ? 0.7 : 1 }]}>
                            <NormalText>Create backup</NormalText>
                        </Pressable>
                        <Pressable
                            onPress={restoreLibraryData}
                            style={({ pressed }) => [styles.button, { borderTopRightRadius: 20, borderBottomRightRadius: 20, opacity: pressed ? 0.7 : 1 }]}>
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
    storageButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    button: {
        paddingVertical: 15,
        backgroundColor: COLORS.gray,
        flex: 1,
        alignItems: 'center'
    }
})
