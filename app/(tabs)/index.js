import { View, Text, StyleSheet, FlatList, TouchableHighlight, Image, ScrollView, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react'
import { COLORS } from '../../constants'
import { SectionTextHeader, PopularCard, LatestUpdateCard, Card } from '../../components';
import { Stack, router } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements'
import useFeaturedTitles from '../../hooks/useFeatureTitles';
import { useManga } from '../../contexts/useManga';


export default function index() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const headerHeight = useHeaderHeight()
    const { data: featuredTitles, isLoading, error } = useFeaturedTitles()
    const slideRef = useRef(null)
    const scrollX = useRef(new Animated.Value(0)).current
    const { latestUpdates } = useManga();

    return (
        <ScrollView style={styles.container}>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 20, lineHeight: 22, color: COLORS.white, position: 'absolute', left: 15, top: headerHeight, zIndex: 10 }}>
                    Popular New Title
                </Text>
                {!isLoading && <FlatList
                    data={featuredTitles.data}
                    keyExtractor={(obj) => obj.id}
                    renderItem={(obj, index) => <PopularCard manga={obj.item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                    scrollEventThrottle={32}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                    ref={slideRef}
                />}

            </View>

            <View style={{ marginBottom: 20, marginHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SectionTextHeader>Latest Update</SectionTextHeader>
                    <TouchableHighlight onPress={() => router.push("/latest")}><Text style={{ fontFamily: 'Poppins_400Regular', color: COLORS.white }}>View all</Text></TouchableHighlight>
                </View>
                {Object.entries(latestUpdates).length < 1 ? (
                    <div>Loading</div>
                ) : (
                    Object.entries(latestUpdates)
                        .slice(0, 6)
                        .map(([mangaId, { manga, chapterList }]) => {
                            return (
                                <LatestUpdateCard key={mangaId} manga={manga} chapterList={chapterList} />
                            );
                        })
                )}
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