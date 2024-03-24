import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import { COLORS, images } from '../../constants';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';
import Chapter from '../../components/Chapter';
import { LinearGradient } from 'expo-linear-gradient';


export default function Manga() {
    const { id } = useLocalSearchParams()
    const headerHeight = useHeaderHeight()
    return (
        <ScrollView style={{ flex: 1, gap: 10, backgroundColor: COLORS.black }}>
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
            <ImageBackground source={images.cover} style={[styles.backgroundImage, { paddingTop: headerHeight }]} >
                <LinearGradient style={[styles.innerContainer, { top: -headerHeight }]} colors={['rgba(0,0,0, 0.6)', COLORS.black]} locations={[0.5, 0.7]}></LinearGradient>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'stretch', marginBottom: 10 }}>
                    <Image source={images.cover} style={styles.cover} />
                    <View style={{ flex: 1, overflow: 'hidden', justifyContent: "center", gap: 4 }}>
                        <Text numberOfLines={10} style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, lineHeight: 22, color: COLORS.white }}>
                            Shouwaru Tensai Osananajimi to no Shoubu ni Makete Hatsutaiken o Zenbu Ubawareru Hanashi
                        </Text>

                        <View numberOfLines={3} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="person-outline" size={12} color={COLORS.white} />
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: COLORS.white }}>
                                Inukai Anzu, Konata Eru, Neibi
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <MaterialCommunityIcons name="clock-outline" size={12} color={COLORS.white} />
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: COLORS.white }}>
                                Ongoing
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10, paddingHorizontal: 15 }}>
                <TouchableOpacity style={{ padding: 6, borderRadius: 5, backgroundColor: COLORS.primary }}>
                    <Feather name="bookmark" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 6, paddingHorizontal: 20, borderRadius: 5, backgroundColor: COLORS.gray, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10, flex: 1 }}>
                    <Feather name="book-open" size={24} color={COLORS.white} />
                    <Text style={{ color: COLORS.white, fontFamily: 'Poppins_400Regular', fontSize: 16 }}>Read</Text>
                </TouchableOpacity>
            </View>

            <Text numberOfLines={3} style={{ fontFamily: 'Poppins_400Regular', color: COLORS.white, fontSize: 12, paddingHorizontal: 15, marginBottom: 10 }}>
                The prince-like girl, Asahi, and supposedly normal (but of course handsome and earnest) guy Kuro are in the same club. They agree to pretend to date as a 'Boyfriend/Girlfriend Tutorial'. You know where this is going, it's complete romcom fluff- and if you like that you'll like this.
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, overflow: 'hidden', paddingHorizontal: 15, marginBottom: 15 }}>
                <View style={styles.tagContainer}><Text style={styles.tag}>Suggestive</Text></View>
                <View style={styles.tagContainer}><Text style={styles.tag}>Suggestive</Text></View>
                <View style={styles.tagContainer}><Text style={styles.tag}>Suggestive</Text></View>
                <View style={styles.tagContainer}><Text style={styles.tag}>Suggestive</Text></View>
            </View>

            <View style={{ paddingHorizontal: 15 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: COLORS.white, marginVertical: 10 }}>132 chapter</Text>
                <View style={{ gap: 15 }}>
                    <Chapter />
                    <Chapter />
                    <Chapter />
                    <Chapter />
                    <Chapter />
                    <Chapter />
                    <Chapter />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'relative',
        zIndex: -10,
        width: '100%',
        height: 'auto',
        padding: 15,
    },
    innerContainer: {
        flex: 1,
        position: 'absolute',
        zIndex: -1,
        left: -15,
        height: '180%',
        width: '200%',
    },
    cover: {
        width: 98,
        height: 140,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    tagContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 5,
        backgroundColor: '#2c2c2c'
    },
    tag: {
        fontFamily: 'Poppins_700Bold',
        color: COLORS.white,
        fontSize: 10
    }
});
