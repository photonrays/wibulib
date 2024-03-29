import { COLORS } from '../constants'
import { Text, TextProps } from 'react-native';
import React from 'react'


export const BoldText: React.FC<TextProps> = (props) => {
    return (
        <Text {...props} style={[{ fontFamily: 'Poppins_700Bold', color: COLORS.white }, props.style]}>
            {props.children}
        </Text>
    )
}
