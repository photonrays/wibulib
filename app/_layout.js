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

const BACKGROUND_FETCH_TASK = 'fetch-library-updates';

async function schedulePushNotification(title, body) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body: body.length === 1
                ? `${body.length} new chapter!`
                : `${body.length} new chapters!`,
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
        ids[k] = ({ ...val, updatedAtSince: new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 19) })
        libraryJson[key].items[k].updatedAtSince = new Date().toISOString().slice(0, 19)
    }))

    const requestParams = {
        limit: 500,
        includes: [Includes.SCANLATION_GROUP, Includes.USER],
        order: { volume: Order.DESC, chapter: Order.DESC },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.EROTICA, MangaContentRating.SUGGESTIVE, MangaContentRating.PORNOGRAPHIC],
        translatedLanguage: ['vi']
    };

    const updates = {}

    for (const id of Object.keys(ids)) {
        const { data } = await getMangaIdFeed(id, { ...requestParams, updatedAtSince: ids[id].updatedAtSince })
        if (data && data.data && data.data.length !== 0) {
            updates[id] = { ...ids[id], updatedAtSince: new Date(Date.now()).toISOString().slice(0, 19), items: data.data }
            await schedulePushNotification(ids[id].title, data.data);
        }
    }

    console.log("updates: ", updates)
    storage.set('updates', JSON.stringify(updates))

    return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 5, // 5 second
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
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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