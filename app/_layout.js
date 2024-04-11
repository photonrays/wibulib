import { Stack } from 'expo-router/stack';
import { useFonts, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { Button, StyleSheet, Text, View } from 'react-native';
import { MangaProvider } from '../contexts/useManga';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { getMangaIdFeed, getSearchManga } from '../api/manga';
import { storage } from '../store/MMKV';
import { Includes, MangaContentRating, Order } from '../api/static';

const BACKGROUND_FETCH_TASK = 'fetch-library-updates';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const library = storage.getString('library')
    const libraryJson = JSON.parse(library)
    console.log(libraryJson);

    const ids = {}
    Object.values(libraryJson).forEach((value) => Object.entries(value.items).forEach(([key, val]) => ids[key] = ({ ...val, createdAtSince: new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 19) })))

    const requestParams = {
        limit: 500,
        includes: [Includes.SCANLATION_GROUP, Includes.USER],
        order: { volume: Order.DESC, chapter: Order.DESC },
        contentRating: [MangaContentRating.SAFE, MangaContentRating.EROTICA, MangaContentRating.SUGGESTIVE, MangaContentRating.PORNOGRAPHIC],
        translatedLanguage: ['vi']
    };

    const updates = {}

    for (const id of Object.keys(ids)) {
        const { data } = await getMangaIdFeed(id, { ...requestParams, createdAtSince: ids[id].createdAtSince })
        if (data && data.data && data.data.length !== 0) {
            updates[id] = { ...ids[id], createdAtSince: new Date(Date.now()).toISOString().slice(0, 19), items: data.data }
        }
    }

    console.log("updates: ", updates)

    storage.set('updates', JSON.stringify(updates))

    return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 1 * 60, // task will fire 1 minute after app is backgrounded
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}

async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function AppLayout() {
    const [isRegistered, setIsRegistered] = useState(false);
    const [status, setStatus] = useState(null);

    const checkStatusAsync = async () => {
        const status = await BackgroundFetch.getStatusAsync();
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
        setStatus(status);
        setIsRegistered(isRegistered);
    };

    const toggleFetchTask = async () => {
        if (isRegistered) {
            await unregisterBackgroundFetchAsync();
        } else {
            await registerBackgroundFetchAsync();
        }

        checkStatusAsync();
    };

    useEffect(() => {
        const toggleFetch = async () => {
            if (!isRegistered) {
                await registerBackgroundFetchAsync();
            }
            checkStatusAsync()
        }

        toggleFetch()
    }, []);

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <Text> Loading...</Text>;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MangaProvider>
                <View style={styles.screen}>
                    <View style={styles.textContainer}>
                        <Text>
                            Background fetch status:{' '}
                            <Text style={styles.boldText}>
                                {status && BackgroundFetch.BackgroundFetchStatus[status]}
                            </Text>
                        </Text>
                        <Text>
                            Background fetch task name:{' '}
                            <Text style={styles.boldText}>
                                {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
                            </Text>
                        </Text>
                    </View>
                    <View style={styles.textContainer}></View>
                    <Button
                        title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
                        onPress={toggleFetchTask}
                    />
                </View>
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