import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { COLORS } from '../constants';
import { BoldText } from '../components';
import { storage } from '../store/MMKV';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';
import * as MediaLibrary from 'expo-media-library';


export default function Storage() {
    const width = Dimensions.get('window').width
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


    async function saveFileAsync(file_uri) {
        try {
            if (permissionResponse.status !== 'granted') {
                await requestPermission();
            }
            if (permissionResponse.status === "granted") {
                const asset = await MediaLibrary.createAssetAsync(file_uri);
                const album = await MediaLibrary.getAlbumAsync('Download');
                if (album === null) {
                    await MediaLibrary.createAlbumAsync('Download', asset, false);
                } else {
                    await MediaLibrary.addAssetsToAlbumAsync([asset], 'Download', false);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.log('ERR: saveFileAsync', error);
            throw error;
        }
    }


    const backupLibraryData = async () => {
        if (Platform.OS === "android") {
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const base64 = await FileSystem.readAsStringAsync(
                    FileSystem.documentDirectory + 'SQLite/example.db',
                    {
                        encoding: FileSystem.EncodingType.Base64
                    }
                );

                await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, 'example.db', 'application/octet-stream')
                    .then(async (uri) => {
                        await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    })
                    .catch((e) => console.log(e));
            } else {
                console.log("Permission not granted");
            }
        } else {
            await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/example.db');
        }

        try {
            const data = storage.getString('library'); // Get data for key 'library'

            if (!data) {
                console.warn("Key 'library' not found in MMKV storage");
                return;
            }

            const formattedDate = format(new Date(), 'dd-MM-yyyy');
            const fileUri = `${documentDirectory}${`wibulib-backup-${formattedDate}.txt`}`;
            console.log("file URI: ", fileUri);

            // Write parsed data to a file within document directory
            FileSystem.StorageAccessFramework.createFileAsync(documentDirectory, `wibulib-backup-${formattedDate}`, 'text/plain').then((uri) => console.log(uri)).catch(e => console.log(e))
            writeAsStringAsync(fileUri, data).then(async () => {
                try {
                    const asset = await MediaLibrary.createAssetAsync(fileUri);
                    const album = await MediaLibrary.getAlbumAsync('Download');
                    if (album == null) {
                        await MediaLibrary.createAlbumAsync('Download', asset, false);
                    } else {
                        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                    }
                } catch (e) {
                    console.log(e);
                }
            })

            console.log('Backup successful');
        } catch (error) {
            console.error('Error during backup:', error);
        }
    };

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

            <View>
                <Pressable onPress={backupLibraryData}>
                    <BoldText>
                        Backup
                    </BoldText>
                </Pressable>
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
