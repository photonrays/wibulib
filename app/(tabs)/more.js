import { View, StyleSheet, StatusBar, ScrollView, Dimensions, Pressable, Image } from 'react-native';
import { COLORS, images } from '../../constants';
import { BoldText, DetailCard, NormalText, SemiBoldText } from '../../components';
import { Octicons, Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';


export default function More() {
    const width = Dimensions.get('window').width

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={[styles.detail, { width: width }]}>
                <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
                    <Octicons name="gear" size={22} color={COLORS.white} />
                </View>
                <BoldText style={{ fontSize: 20 }}>SETTINGS</BoldText>
            </View>

            <View>
                <Pressable
                    style={({ pressed }) => [styles.button, { backgroundColor: pressed ? COLORS.gray : COLORS.black }]}
                    onPressOut={() => { router.navigate('/storage') }}
                >
                    <MaterialIcons name="storage" size={24} color={COLORS.white} />
                    <View>
                        <NormalText style={{ fontSize: 16 }}>Data and storages</NormalText>
                        <NormalText style={{ fontSize: 12 }}>Storage location, Backup and restore</NormalText>
                    </View>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.button, { backgroundColor: pressed ? COLORS.gray : COLORS.black }]}
                    onPress={() => { router.push('/about') }}
                >
                    <AntDesign name="exclamationcircleo" size={24} color={COLORS.white} />
                    <View>
                        <NormalText style={{ fontSize: 16 }}>About</NormalText>
                        <NormalText style={{ fontSize: 12 }}>wibulib v1.0.0</NormalText>
                    </View>
                </Pressable>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black,
        // padding: 15,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingTop: StatusBar.currentHeight,
        margin: 15
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        height: 70,
        paddingHorizontal: 25
    }
})
