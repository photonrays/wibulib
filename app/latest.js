import { Text, View } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS } from '../constants'
import { Stack } from 'expo-router'

export default function latest() {
    const headerHeight = useHeaderHeight()

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.black, paddingTop: headerHeight }}>
            <Stack.Screen options={{
                title: "Latest Update",
                headerShown: true,
                headerTransparent: true,
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'Poppins_700Bold',
                },
                headerBackVisible: true
            }} />

            <Text>Latest update</Text>
        </View>
    )
}