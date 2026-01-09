import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CustomDrawer(props) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top }}>
                {/* HEADER */}
                <TouchableOpacity
                    style={styles.header}
                    onPress={() => router.push('/(tabs)/profile')}
                >
                    <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.avatar} />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.name}>Ouazzou abdelhamid</Text>
                        <Text style={styles.viewProfile}>Voir le profil</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* MENU ITEMS */}
                <DrawerItem
                    label="Nouveautés"
                    icon={({ color }) => <Ionicons name="flash-outline" size={22} color="white" />}
                    labelStyle={styles.label}
                    onPress={() => { }}
                />
                <DrawerItem
                    label="Préférences"
                    icon={({ color }) => <Ionicons name="settings-outline" size={22} color="white" />}
                    labelStyle={styles.label}
                    onPress={() => { }}
                />
            </DrawerContentScrollView>

            {/* LOGOUT */}
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#333' }}>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="log-out-outline" size={22} color="white" />
                    <Text style={{ color: 'white', marginLeft: 15 }}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    name: { color: 'white', fontWeight: 'bold' },
    viewProfile: { color: 'gray', fontSize: 12 },
    divider: { height: 1, backgroundColor: '#333', marginVertical: 10 },
    label: { color: 'white' }
});