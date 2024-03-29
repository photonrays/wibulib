import { View, Text, StyleSheet, FlatList, TouchableHighlight, Image, ScrollView, Animated, StatusBar } from 'react-native';
import { useState, useEffect, useRef } from 'react'
import { COLORS } from '../../constants'
import { SectionTextHeader, PopularCard, LatestUpdateCard, Card, NormalText } from '../../components';
import { Stack, router } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements'
import useFeaturedTitles from '../../hooks/useFeatureTitles';
import { useManga } from '../../contexts/useManga';
import { FontAwesome6 } from '@expo/vector-icons';


export default function index() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const headerHeight = useHeaderHeight()
    const { data: featuredTitles, isLoading, error } = useFeaturedTitles()
    const slideRef = useRef(null)
    const scrollX = useRef(new Animated.Value(0)).current
    const { latestUpdates } = useManga();

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <View style={{ marginBottom: 20 }}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <SectionTextHeader style={{ color: COLORS.primary, fontSize: 28, lineHeight: 30 }}>
                            WIBULIB
                        </SectionTextHeader>
                        <FontAwesome6 name="magnifying-glass" size={24} color={COLORS.white} />
                    </View>
                    <SectionTextHeader>
                        Popular New Title
                    </SectionTextHeader>
                </View>
                {!isLoading && featuredTitles?.data && <FlatList
                    data={featuredTitles.data}
                    keyExtractor={(obj) => obj.id}
                    renderItem={(obj, index) => <PopularCard key={index} manga={obj.item} />}
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
            {/* <View></View> */}
            <View style={{ marginBottom: 20, marginHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SectionTextHeader style={{ marginBottom: 10 }}>Latest Update</SectionTextHeader>
                    <TouchableHighlight onPress={() => router.push("/latest")}>
                        <NormalText>View all</NormalText>
                    </TouchableHighlight>
                </View>
                {Object.entries(latestUpdates).length < 1 ? (
                    <Text>Loading</Text>
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
                    <SectionTextHeader style={{ marginBottom: 10 }}>Top Manga</SectionTextHeader>
                    <TouchableHighlight>
                        <NormalText>View All</NormalText>
                    </TouchableHighlight>
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
        position: 'relative',
    },
    header: {
        position: 'absolute',
        height: 80,
        justifyContent: 'space-between',
        left: 15,
        top: StatusBar.currentHeight + 20,
        zIndex: 10,
        right: 20
    }
});