import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getChart } from '../../src/services/deezer';
import { useMusic } from '../../src/context/MusicContext';
import { useNavigation } from 'expo-router'; // <--- Kept this
import { DrawerActions } from '@react-navigation/native'; // <--- Kept this
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const [data, setData] = useState({ tracks: [], albums: [], playlists: [] });
    const [loading, setLoading] = useState(true);
    const { setCurrentTrack } = useMusic();
    const router = useRouter();

    // 1. ADD THIS: Initialize navigation so the button works
    const navigation = useNavigation();

    useEffect(() => {
        async function loadData() {
            const chartData = await getChart();
            setData(chartData);
            setLoading(false);
        }
        loadData();
    }, []);

    // 1. REUSABLE COMPONENT: A Single Horizontal Section
    const Section = ({ title, list }) => (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <FlatList
                data={list}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            if (item.type === 'track') {
                                // If it's a song, play it
                                setCurrentTrack(item);
                            } else {
                                // If it's an album/playlist, go to the detail page
                                // We use router.push with the folder structure we made
                                // e.g. /details/album/94384
                                router.push(`/details/${item.type}/${item.id}`);
                            }
                        }}
                    >
                        <Image
                            source={{ uri: item.cover_medium || item.picture_medium || item.album.cover_medium }}
                            style={styles.cover}
                        />
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.cardSubtitle} numberOfLines={1}>
                            {item.artist ? item.artist.name : item.user.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    if (loading) return <ActivityIndicator size="large" style={{marginTop: 50}} />;

    return (
        <ScrollView style={styles.container}>
            {/* 2. MODIFIED HEADER: Now includes the Avatar Button */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/300' }}
                        style={styles.headerAvatar}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Good Morning ☀️</Text>
            </View>

            {/* 2. STACK THE SECTIONS VERTICALLY (Unchanged) */}
            <Section title="Top Tracks 🔥" list={data.tracks} />
            <Section title="Top Albums 💿" list={data.albums} />
            <Section title="Hot Playlists 🎧" list={data.playlists} />

            <View style={{height: 100}} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', paddingTop: 50 },

    // 3. NEW HEADER STYLES (Replaces the old 'header' style)
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white'
    },

    sectionContainer: { marginBottom: 30 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 20, marginBottom: 15 },

    card: { marginLeft: 20, width: 140 },
    cover: { width: 140, height: 140, borderRadius: 10, marginBottom: 10 },
    cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    cardSubtitle: { color: 'gray', fontSize: 12 }
});