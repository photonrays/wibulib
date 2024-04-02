import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native';
import { COLORS } from '../../constants';
import { BoldText, NormalText } from '../../components';
import { Stack } from 'expo-router';


export default function Library() {
    const win = Dimensions.get('window')
    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false,
            }} />
            <StatusBar backgroundColor={'transparent'} />
            <View style={{ flex: 1 }}>
                <View style={[styles.titleContainer, { width: win.width }]}>
                    <BoldText style={{ fontSize: 20, }}>LIBRARY</BoldText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        position: 'relative',
    },
    titleContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight + 20,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})
