import { Stack } from 'expo-router/stack';
import { useFonts, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { Text } from 'react-native';


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
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}
