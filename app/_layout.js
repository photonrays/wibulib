import { Stack } from 'expo-router/stack';
import { Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { MangaProvider } from '../contexts/useManga';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font'
import { useCallback, useEffect, useState } from 'react';
import { getMangaIdFeed } from '../api/manga';
import { storage } from '../store/MMKV';
import { Includes, MangaContentRating, Order } from '../api/static';
import usePushNotification from '../hooks/usePushNotifications';
import { COLORS, images } from '../constants';
import scheduleNotification from '../utils/scheduleNotification';
import useNotificationObserver from '../hooks/useNotificationObserver';

const BACKGROUND_FETCH_TASK = 'fetch-library-updates';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const library = storage.getString('library')
    const libraryJson = JSON.parse(library)

    const ids = {}
    Object.entries(libraryJson).forEach(([key, value]) => Object.entries(value.items).forEach(([k, val]) => {
        ids[k] = ({ ...val, updatedAtSince: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 19) })
        libraryJson[key].items[k].updatedAtSince = new Date().toISOString().slice(0, 19)
    }))

    storage.set('library', JSON.stringify(libraryJson))

    const requestParams = {
        limit: 500,
        includes: [Includes.SCANLATION_GROUP, Includes.USER],
        order: { volume: Order.DESC, chapter: Order.DESC },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.EROTICA, MangaContentRating.SUGGESTIVE, MangaContentRating.PORNOGRAPHIC],
        translatedLanguage: ['en']
    };
    const updates = storage.getString('updates')
    const updatesJson = updates ? JSON.parse(updates) : {}

    await scheduleNotification("Fetching new updates", "fetching...")
    for (const id of Object.keys(ids)) {
        const { data } = await getMangaIdFeed(id, { ...requestParams, updatedAtSince: ids[id].updatedAtSince })
        if (data && data.data && data.data.length !== 0) {
            data.data.forEach(d => {
                if (updatesJson[d.attributes.updatedAt.slice(0, 10)] == undefined) {
                    updatesJson[d.attributes.updatedAt.slice(0, 10)] = []
                }
                updatesJson[d.attributes.updatedAt.slice(0, 10)].push({ manga: { ...ids[id], id }, chapter: d })
                scheduleNotification(ids[id].title, getChapterTitle(d), { url: { pathname: `/chapter/${d.id}`, params: { mangaId: id } } });
            });
        }
    }

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
    usePushNotification()
    useNotificationObserver()

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
        return <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black, height: '100%' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
                <Image source={images.logo} style={{ width: '100%' }} resizeMode='contain' />
            </View>
        </SafeAreaView>
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.black }} onLayout={onLayoutRootView}>
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