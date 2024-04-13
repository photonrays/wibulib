import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants';
import { Icon, Icons, NormalText } from "../../components"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const TabArr = [
    { route: 'index', label: 'Home', type: Icons.FontAwesome, icon: 'home', },
    { route: 'history', label: 'History', type: Icons.Octicons, icon: 'history' },
    { route: 'updates', label: 'Updates', type: Icons.Ionicons, icon: 'notifications-sharp' },
    { route: 'library', label: 'Library', type: Icons.Ionicons, icon: 'library' },
    { route: 'search', label: 'Search', type: Icons.FontAwesome6, icon: 'magnifying-glass' },
];

const TabButton = ({ item, onPress, accessibilityState }) => {
    const focused = accessibilityState.selected;
    const viewRef = useRef(null);

    const animation = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            paddingHorizontal: animation.value == 1
                ? withTiming(20, { duration: 120 })
                : withTiming(10, { duration: 120 })
        }
    })

    useEffect(() => {
        if (focused) {
            animation.value = 1
        } else {
            animation.value = 0
        }
    }, [focused])

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={[styles.container, { flex: 1 }]}>
            <Animated.View ref={viewRef} style={[styles.btn, { backgroundColor: focused ? COLORS.black : COLORS.gray }, animatedStyle]}>
                <Icon type={item.type} name={item.icon} color={focused ? COLORS.primary : COLORS.white} />
            </Animated.View>
            <View>
                <NormalText style={{
                    color: focused ? COLORS.primary : COLORS.white, fontSize: 12
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
