import { View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import getChapterTitle from '../utils/getChapterTitle';
import { formatNowDistance } from '../utils/dateFns';
import { Link } from 'expo-router';
import { NormalText } from './NormalText';

export default function Chapter({ chapter }) {
    const chapterTitle = getChapterTitle(chapter)
    return (
        <Link push href={`/chapter/${chapter.id}`}>
            <View style={{ gap: 5 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <FontAwesome name="circle" size={6} color="white" />
                    <NormalText numberOfLines={1} style={{ fontSize: 13 }}>
                        {chapterTitle}
                    </NormalText>
                </View>
                <NormalText style={{ fontSize: 12 }}>{formatNowDistance(new Date(chapter.attributes?.readableAt)) || ""}</NormalText>
            </View>
        </Link>
    )
}
