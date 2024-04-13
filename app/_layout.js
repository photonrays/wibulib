import { Stack } from 'expo-router/stack';
import { Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { StyleSheet, Text, View } from 'react-native';
import { MangaProvider } from '../contexts/useManga';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font'
import { useCallback, useEffect, useState } from 'react';
import { getMangaIdFeed } from '../api/manga';
import { storage } from '../store/MMKV';
import { Includes, MangaContentRating, Order } from '../api/static';
import usePushNotification from '../hooks/usePushNotifications';
import isEmpty from '../utils/isEmpty';
import { COLORS } from '../constants';

const BACKGROUND_FETCH_TASK = 'fetch-library-updates';

async function schedulePushNotification(title, body) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: {},
        },
        trigger: { seconds: 2 },
    });
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const library = storage.getString('library')
    const libraryJson = JSON.parse(library)

    const ids = {}
    Object.entries(libraryJson).forEach(([key, value]) => Object.entries(value.items).forEach(([k, val]) => {
        ids[k] = ({ ...val, updatedAtSince: val.updatedAtSince || new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 19) })
        libraryJson[key].items[k].updatedAtSince = new Date().toISOString().slice(0, 19)
    }))

    console.log("libraryJson: ", libraryJson)
    storage.set('library', JSON.stringify(libraryJson))

    const requestParams = {
        limit: 500,
        includes: [Includes.SCANLATION_GROUP, Includes.USER],
        order: { volume: Order.DESC, chapter: Order.DESC },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.EROTICA, MangaContentRating.SUGGESTIVE, MangaContentRating.PORNOGRAPHIC],
        translatedLanguage: ['vi']
    };
    const updates = storage.getString('updates')
    const updatesJson = updates ? JSON.parse(updates) : {}
    const updateData = {}

    await schedulePushNotification("Fetching new updates", "fetching...");
    for (const id of Object.keys(ids)) {
        const { data } = await getMangaIdFeed(id, { ...requestParams, updatedAtSince: ids[id].updatedAtSince })
        if (data && data.data && data.data.length !== 0) {
            updateData[id] = { ...ids[id], items: data.data }
            const body = data.data.length === 1
                ? `${data.data.length} new chapter!`
                : `${data.data.length} new chapters!`
            await schedulePushNotification(ids[id].title, body);
        }
    }

    if (!isEmpty(updateData)) {
        updatesJson[Date.now()] = updateData
    }

    console.log("updatesJson: ", updatesJson)
    storage.set('updates', JSON.stringify(updatesJson))

    return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 24 * 60 * 60, // 1 day
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}


export default function AppLayout() {
    const [appIsReady, setAppIsReady] = useState(false);
    const { } = usePushNotification()

    useEffect(() => {
        (async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync({
                    Poppins_400Regular,
                    Poppins_700Bold,
                    Poppins_500Medium,
                });
                registerBackgroundFetchAsync()
            }
            catch (e) {
                console.warn(e);
            }
            finally {
                setAppIsReady(true);
            }
        })();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black }}>
            <Text>Loading</Text>
        </View>;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <MangaProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </MangaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    screen: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
});