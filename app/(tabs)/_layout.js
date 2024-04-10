import React, { useEffect, useRef } from 'react';
import { Octicons, Feather, FontAwesome6, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants';
import { Icon, Icons, NormalText } from "../../components"
import * as Animatable from 'react-native-animatable';

const TabArr = [
    { route: 'index', label: 'Home', type: Icons.FontAwesome, icon: 'home', },
    { route: 'history', label: 'History', type: Icons.Octicons, icon: 'history' },
    { route: 'library', label: 'Library', type: Icons.Ionicons, icon: 'library' },
    { route: 'search', label: 'Search', type: Icons.FontAwesome6, icon: 'magnifying-glass' },
];

const TabButton = ({ item, onPress, accessibilityState }) => {
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);

    useEffect(() => {
        if (focused) {
            viewRef.current.animate({ 0: { paddingHorizontal: 10 }, 1: { paddingHorizontal: 30 } });
        } else {
            viewRef.current.animate({ 0: { paddingHorizontal: 30, }, 1: { paddingHorizontal: 10, } });
        }
    }, [focused])

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={[styles.container, { flex: 1 }]}>
            <Animatable.View ref={viewRef} style={[styles.btn, { backgroundColor: focused ? COLORS.black : COLORS.gray }]}>
                <Icon type={item.type} name={item.icon} color={focused ? COLORS.primary : COLORS.white} />
            </Animatable.View>
            <View>
                <NormalText style={{
                    color: focused ? COLORS.primary : COLORS.white, paddingHorizontal: 8
                }}>{item.label}</NormalText>
            </View>
        </TouchableOpacity>
    )
}

export default function TabLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 80,
                    backgroundColor: COLORS.gray,
                    borderColor: COLORS.gray
                }
            }}>
                {TabArr.map((item, index) => {
                    return (
                        <Tabs.Screen
                            key={index}
                            name={item.route}
                            options={{
                                title: item.label,
                                tabBarShowLabel: false,
                                tabBarButton: (props) => <TabButton {...props} item={item} />
                            }}
                        />
                    )
                })}
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 16,
    }
})
