import { View, StyleSheet, StatusBar, ScrollView, Dimensions, RefreshControl, Pressable, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { useMMKVObject } from 'react-native-mmkv';
import { PaperProvider } from 'react-native-paper';
import { COLORS, images } from '../constants';
import { BoldText, DetailCard2, SemiBoldText } from '../components';


export default function About() {
    const width = Dimensions.get('window').width

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={[styles.detail, { width: width }]}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </Pressable>
                <BoldText style={{ fontSize: 20 }}>About</BoldText>
            </View>
            <View style={{ height: 256, width: '100%', alignItems: 'center', marginTop: -20 }}>
                <Image source={images.logo} style={{ width: 256, height: 256 }} resizeMode='contain' />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        padding: 15
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingTop: StatusBar.currentHeight,
    }
})
