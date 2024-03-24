import { View, Text, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight, Image, ScrollView } from 'react-native';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { COLORS } from '../../constants'
import { SectionTextHeader, PopularCard, LatestUpdateCard, Card } from '../../components';
import { Stack, router } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements'

export default function index() {
    const [data, setData] = useState()
    const headerHeight = useHeaderHeight()


    useEffect(() => {
        axios.get('https://api.mangadex.dev/manga')
            .then(res => {
                console.log(res)
            })
    }, [])

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return <Text> Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 20, lineHeight: 22, color: COLORS.white, position: 'absolute', left: 15, top: headerHeight }}>
                    Popular New Title
                </Text>
                <PopularCard />
            </View>

            <View style={{ marginBottom: 20, marginHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SectionTextHeader>Latest Update</SectionTextHeader>
                    <TouchableHighlight onPress={() => router.push("/latest")}><Text style={{ fontFamily: 'Poppins_400Regular', color: COLORS.white }}>View all</Text></TouchableHighlight>
                </View>
                <FlatList
                    data={[{}, {}, {}, {}]}
                    renderItem={({ item }) => <LatestUpdateCard />}
                />
            </View>

            <View style={{ marginBottom: 20, marginHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SectionTextHeader>Top Manga</SectionTextHeader>
                    <TouchableHighlight><Text style={{ fontFamily: 'Poppins_400Regular', color: COLORS.white }}>View All</Text></TouchableHighlight>
                </View>
                <FlatList
                    horizontal={true}
                    data={[{}, {}, {}, {}]}
                    renderItem={({ item }) => <Card />}
                    ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        position: 'relative'
    }
});