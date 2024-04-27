import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, Platform, ToastAndroid } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { COLORS } from '../constants';
import { BoldText, LightText, NormalText, SemiBoldText } from '../components';
import { storage } from '../store/MMKV';
import * as FileSystem from 'expo-file-system';
import { useMMKVString } from 'react-native-mmkv';

function getTailPath(uriString) {
    const indexOfPrimary = uriString.indexOf("primary:");
    if (indexOfPrimary !== -1) {
        return "/storage/emulated/0/" + uriString.substring(indexOfPrimary + "primary:".length);
    } else {
        return uriString;
    }
}

export default function Storage() {
    const width = Dimensions.get('window').width
    const [backupLocation, setBackupLocation] = useMMKVString('backup-location', storage)

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

            {/* <Pressable onPress={() => setBackupLocation()}><NormalText>Reset</NormalText></Pressable> */}

            <View style={{ paddingHorizontal: 5 }}>
                <View style={{ marginBottom: 40 }}>
                    <SemiBoldText style={{ fontSize: 15 }}>Storage location</SemiBoldText>
                    {backupLocation ?
                        <Pressable
                            onPress={setStorageLocation}
                            style={({ pressed }) => [
                                styles.storageButton,
                                {
                                    opacity: pressed ? 0.7 : 1,
                                }]}>
                            <LightText style={{ fontSize: 12 }}>{getTailPath(decodeURIComponent(backupLocation))}</LightText>
                        </Pressable>
                        : <Pressable
                            onPress={setStorageLocation}
                            style={({ pressed }) => [
                                styles.storageButton,
                                {
                                    alignItems: 'center',
                                    marginTop: 10,
                                    paddingVertical: 10,
                                    backgroundColor: COLORS.gray,
                                    opacity: pressed ? 0.7 : 1,
                                }]}>
                            <NormalText>{"Select storage location"}</NormalText>
                        </Pressable>}
                </View>

                <View style={{ gap: 10 }}>
                    <SemiBoldText style={{ fontSize: 15 }}>Backup and Restore</SemiBoldText>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <Pressable
                            onPress={navigateToBackup}
                            style={({ pressed }) => [styles.button, { borderTopLeftRadius: 20, borderBottomLeftRadius: 20, opacity: pressed ? 0.7 : 1 }]}>
                            <NormalText>Create backup</NormalText>
                        </Pressable>
                        <Pressable
                            onPress={() => router.push('/restore')}
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
        marginBottom: 20
    },
    storageButton: {
        width: '100%',
        borderRadius: 10,
    },
    button: {
        paddingVertical: 13,
        backgroundColor: COLORS.gray,
        flex: 1,
        alignItems: 'center'
    }
})
