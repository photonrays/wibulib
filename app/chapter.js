import { Text, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS } from '../constants'
import { Stack } from 'expo-router'

export default function chapter() {
    const headerHeight = useHeaderHeight()

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.black, paddingTop: headerHeight }}>
            <Stack.Screen options={{
                title: "chapter",
                headerShown: true,
                headerTransparent: true,
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'Poppins_700Bold',
                    fontWeight: 'bold',
                },
                headerBackVisible: true
            }} />

            <Text>chapter</Text>
        </View>
    )
}