import { Image, ScrollView, Text, View, Dimensions, FlatList } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS } from '../../constants'
import { Stack, useLocalSearchParams } from 'expo-router'
import useChapterPages from '../../hooks/useChapterPages'
import FitImage from 'react-native-fit-image';


export default function Chapter() {
    const { id } = useLocalSearchParams();
    const { pages, isLoading } = useChapterPages(id)
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.black }}>
            <Stack.Screen options={{
                title: "",
                headerShown: true,
                headerTransparent: true,
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'Poppins_700Bold',
                    fontWeight: 'bold',
                },
                headerBackVisible: true
            }} />
            <FlatList
                data={pages}
                renderItem={(page, index) => <FitImage style={{ marginBottom: 10 }} key={index} source={{ uri: page.item }} />}
            />
        </View>
    )
}