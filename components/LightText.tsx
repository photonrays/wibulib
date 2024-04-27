import { COLORS } from '../constants'
import { Text, TextProps } from 'react-native';
import React from 'react'


export const LightText: React.FC<TextProps> = (props) => {
    return (
        <Text {...props} style={[{ fontFamily: 'Poppins_200ExtraLight', color: COLORS.white }, props.style]}>
            {props.children}
        </Text>
    )
}
