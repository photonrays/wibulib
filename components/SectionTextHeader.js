import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { COLORS } from '../constants'
import { Text } from 'react-native';


export default function SectionTextHeader({ children }) {
    let [fontsLoaded] = useFonts({
        Poppins_500Medium,
    });

    if (!fontsLoaded) {
        return <Text> Loading...</Text>;
    }

    return (
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 20, lineHeight: 22, color: COLORS.white, marginBottom: 10 }}>
            {children}
        </Text>
    )
}
