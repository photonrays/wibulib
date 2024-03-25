import { Stack } from 'expo-router/stack';
import { useFonts, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { Text } from 'react-native';
import { MangaProvider } from '../contexts/useManga';


export default function AppLayout() {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
        Poppins_500Medium
    });

    if (!fontsLoaded) {
        return <Text> Loading...</Text>;
    }

    return (
        <MangaProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </MangaProvider>
    );
}
