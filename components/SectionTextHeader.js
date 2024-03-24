import { COLORS } from '../constants'
import { Text } from 'react-native';


export default function SectionTextHeader({ children }) {
    return (
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 20, lineHeight: 22, color: COLORS.white, marginBottom: 10 }}>
            {children}
        </Text>
    )
}
