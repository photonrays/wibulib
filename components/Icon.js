import React from 'react';

import {
    AntDesign,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Ionicons,
    Feather, MaterialCommunityIcons, Entypo, MaterialIcons, SimpleLineIcons, Octicons, Foundation, EvilIcons
} from '@expo/vector-icons'

export const Icons = {
    MaterialCommunityIcons,
    MaterialIcons,
    Ionicons,
    Feather,
    FontAwesome,
    FontAwesome5,
    AntDesign,
    Entypo,
    SimpleLineIcons,
    Octicons,
    Foundation,
    EvilIcons,
    FontAwesome6
}


const Icon = ({ type, name, color, size = 24, style }) => {
    const fontSize = 24;
    const Tag = type;
    return (
        <>
            {type && name && (
                <Tag name={name} size={size || fontSize} color={color} style={style} />
            )}
        </>
    )
}

export default Icon