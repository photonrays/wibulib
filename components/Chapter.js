import { View, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../constants';
import getChapterTitle from '../utils/getChapterTitle';
import { formatNowDistance } from '../utils/dateFns';
import { Link } from 'expo-router';

export default function Chapter({ chapter }) {
    const chapterTitle = getChapterTitle(chapter)
    return (
        <Link push href={`/chapter/${chapter.id}`}>
            <View style={{ gap: 5 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <FontAwesome name="circle" size={6} color="white" />
                    <Text numberOfLines={1} style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: COLORS.white }}>
                        {chapterTitle}
                    </Text>
                </View>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: COLORS.white }}>{formatNowDistance(new Date(chapter.attributes?.readableAt)) || ""} {chapter.relationships?.[1].attributes?.name}</Text>
            </View>
        </Link>
    )
}
