import { COLORS } from '../constants'
import { Text, TextProps } from 'react-native';
import React from 'react'


export const SemiBoldText: React.FC<TextProps> = (props) => {
    return (
        <Text {...props} style={[{ fontFamily: 'Poppins_500Medium', color: COLORS.white }, props.style]}>
            {props.children}
        </Text>
    )
}
