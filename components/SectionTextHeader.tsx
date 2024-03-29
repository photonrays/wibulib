import { COLORS } from '../constants'
import { Text, TextProps } from 'react-native';

export const SectionTextHeader: React.FC<TextProps> = (props) => {
    return (
        <Text {...props} style={[{ fontFamily: 'Poppins_500Medium', fontSize: 20, lineHeight: 22, color: COLORS.white }, props.style]}>
            {props.children}
        </Text>
    )
}
