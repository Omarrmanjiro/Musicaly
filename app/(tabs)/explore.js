import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { searchAll } from '../../src/services/deezer';

import { usePlayer } from '../../src/context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const { playTrack } = usePlayer();
    const router = useRouter();

    const handleLiveSearch = async (text) => {
        setQuery(text);

        if (text.length > 0) {
            setLoading(true);
            const data = await searchAll(text);
            setResults(data);
            setLoading(false);
        } else if (text.length === 0) {
            setResults(null);
            setLoading(false);
        }
    };

    const ResultSection = ({ title, list, type }) => {
        if (!list || list.length === 0) return null; // Don't show empty sections

        return (
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
                                if (type === 'track') {
                                    playTrack(item);
                                } else {
                                    // We use the 'type' prop passed to ResultSection ('artist', 'album', etc.)
                                    router.push(`/details/${type}/${item.id}`);
                                }
                            }}
                        >
                            <Image
                                source={{ uri: item.cover_medium || item.picture_medium || item.album?.cover_medium }}
                                style={type === 'artist' ? styles.artistImage : styles.albumImage}
                            />
                            <Text style={styles.cardTitle} numberOfLines={1}>{item.title || item.name}</Text>
                            {type !== 'artist' && (
                                <Text style={styles.cardSubtitle} numberOfLines={1}>
                                    {item.artist ? item.artist.name : 'Album'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Search 🔍</Text>

            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="gray" style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.input}
                    placeholder="Artists, Songs, or Albums..."
                    placeholderTextColor="gray"
                    value={query}
                    onChangeText={handleLiveSearch}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => handleLiveSearch('')}>
                        <Ionicons name="close-circle" size={20} color="gray" />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 50 }} />
            ) : (
                // We use ScrollView because we have multiple horizontal lists stacked
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {results ? (
                        <>
                            <ResultSection title="Songs 🎵" list={results.tracks} type="track" />
                            <ResultSection title="Artists 🎤" list={results.artists} type="artist" />
                            <ResultSection title="Albums 💿" list={results.albums} type="album" />

                            {/* message if nothing found */}
                            {results.tracks.length === 0 && results.artists.length === 0 && (
                                <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>No results found.</Text>
                            )}
                        </>
                    ) : (
                        // Placeholder when not searching
                        <View style={{ alignItems: 'center', marginTop: 50, opacity: 0.5 }}>
                            <Ionicons name="musical-notes" size={50} color="gray" />
                            <Text style={{ color: 'gray', marginTop: 10 }}>Start typing to search...</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', paddingTop: 50, paddingHorizontal: 20 },
    header: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20 },

    searchBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#333',
        borderRadius: 10, paddingHorizontal: 15, height: 50, marginBottom: 20
    },
    input: { flex: 1, color: 'white', fontSize: 16 },

    sectionContainer: { marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 15 },

    card: { marginRight: 15, width: 120 },
    albumImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
    artistImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 }, // Circular for artists

    cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    cardSubtitle: { color: 'gray', fontSize: 12 }
});