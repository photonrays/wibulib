import { View, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../constants';

export default function Chapter() {
    return (
        <View style={{ gap: 5 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <FontAwesome name="circle" size={6} color="white" />
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: COLORS.white }}>
                    Ch.132 - Making Things Worse
                </Text>
            </View>
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: COLORS.white }}>6/15/2023 . Kamen</Text>
        </View>
    )
}
