import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // We use Ionicons for consistent icons

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false, // We hide the top header (Home Page has its own)

                // 1. COLORS
                tabBarActiveTintColor: '#ffffff', // White when selected
                tabBarInactiveTintColor: '#b3b3b3', // Gray when not selected

                // 2. THE BAR STYLE
                tabBarStyle: {
                    backgroundColor: '#121212', // Dark background to match app
                    borderTopWidth: 0, // Remove the ugly top line
                    elevation: 0, // Remove shadow on Android
                    height: Platform.OS === 'ios' ? 85 : 60, // Taller on iPhone for the home bar
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Push icons up a bit
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
        </Tabs>
    );
}
