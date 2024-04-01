import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { SafeAreaView, View } from 'react-native';

export default function TabLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                        tabBarHideOnKeyboard: true,
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: 'History',
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="library"
                    options={{
                        title: 'Library',
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        title: 'Search',
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                    }}
                />
            </Tabs>
        </View>
    );
}
