import { Pressable, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import getChapterTitle from '../utils/getChapterTitle';
import { formatNowDistance } from '../utils/dateFns';
import { router } from 'expo-router';
import { NormalText } from './NormalText';
import { COLORS } from '../constants';

export default function Chapter({ chapter, history }) {
    const chapterTitle = getChapterTitle(chapter)
    return (
        <Pressable
            onPress={() => router.push(`/chapter/${chapter.id}`)}
            style={({ pressed }) => [{
                gap: 5,
                opacity: history?.items[chapter.id] || pressed ? 0.5 : 1,
                backgroundColor: pressed ? COLORS.gray2 : COLORS.black,
                paddingHorizontal: 15,
                paddingVertical: 7
            }]}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                {!history?.items[chapter.id] && <FontAwesome name="circle" size={6} color="white" />}
                <NormalText numberOfLines={1} style={{ fontSize: 13 }}>
                    {chapterTitle}
                </NormalText>
            </View>
            <NormalText style={{ fontSize: 12 }}>
                {formatNowDistance(new Date(chapter.attributes?.readableAt)) || ""}
                {history?.items[chapter.id] ? `  -  pg. ${history.items[chapter.id].page} / ${chapter.attributes.pages}` : ""}
            </NormalText>
        </Pressable>
    )
}
