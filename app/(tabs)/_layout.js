import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MiniPlayer from '../../src/components/MiniPlayer';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            tabBar={(props) => (
                <View style={{ backgroundColor: '#121212' }}>
                    <MiniPlayer />
                    <BottomTabBar {...props} />
                    {Platform.OS === 'android' && <View style={{ height: insets.bottom, backgroundColor: '#121212' }} />}
                </View>
            )}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#b3b3b3',
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 85 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                },
            }}>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "search" : "search-outline"}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='PlaylistManager'
                options={{
                    title: 'Playlists',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "musical-notes" : "musical-notes-outline"}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='payment'
                options={{
                    title: 'Premium',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "diamond" : "diamond-outline"}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    href: null,
                }}
            />
        </Tabs>
    );
}
