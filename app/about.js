import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, Image } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Link, Stack, router } from 'expo-router';
import { COLORS, images } from '../constants';
import { BoldText, LightText, NormalText } from '../components';


export default function About() {
    const width = Dimensions.get('window').width

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={[styles.detail, { width: width }]}>
                <Pressable onPress={() => { router.back() }} style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Feather name="arrow-left" size={24} color={COLORS.white} />
                </Pressable>
                <BoldText style={{ fontSize: 20 }}>About</BoldText>
            </View>
            <View style={{ height: 256, width: '100%', alignItems: 'center', marginTop: -20, marginBottom: -10 }}>
                <Image source={images.logo} style={{ width: 256, height: 256 }} resizeMode='contain' />
            </View>

            <View>
                <View style={{ paddingHorizontal: 5, marginBottom: 20 }}>
                    <LightText style={{ marginBottom: 20 }}>
                        Wibulib is my hobby project inspired by Tachiyomi application and MangaDex website
                    </LightText>

                    <NormalText>Version</NormalText>
                    <LightText style={{ marginBottom: 10 }}>v1.0.0</LightText>
                    <Pressable onPress={() => router.navigate("https://github.com/photonrays")}>
                        <NormalText>Author</NormalText>
                        <LightText>photonrays</LightText>
                    </Pressable>
                </View>

                <View style={{ padding: 10, backgroundColor: COLORS.gray, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <AntDesign name="exclamationcircleo" size={24} color={COLORS.white} />
                    <NormalText style={{}}>This is a third-party app powered by the <Link href="https://api.mangadex.org/docs/" style={{ color: COLORS.primary }}>MangaDex API</Link></NormalText>
                </View>
            </View>

        </View>
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
