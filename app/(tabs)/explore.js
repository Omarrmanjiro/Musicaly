import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, {useEffect, useState} from 'react';
import { searchAll } from '../../src/services/deezer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayer } from '../../src/context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const { playTrack } = usePlayer();
    const router = useRouter();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@search_history');
            if (jsonValue != null) setHistory(JSON.parse(jsonValue));
        } catch(e) { console.log(e); }
    };

    const addToHistory = async (item) => {
        try {
            const newHistory = history.filter(h => h.id !== item.id);
            newHistory.unshift(item);
            if (newHistory.length > 10) newHistory.pop();
            setHistory(newHistory);
            await AsyncStorage.setItem('@search_history', JSON.stringify(newHistory));
        } catch (e) { console.log(e); }
    };
    const removeFromHistory = async (itemId) => {
        try {
            // Filter out the item with the specific ID
            const newHistory = history.filter(item => item.id !== itemId);
            setHistory(newHistory);
            await AsyncStorage.setItem('@search_history', JSON.stringify(newHistory));
        } catch (e) { console.log(e); }
    };
    const clearHistory = async () => {
        setHistory([]);
        await AsyncStorage.removeItem('@search_history');
    };

    const handleLiveSearch = async (text) => {
        setQuery(text);
        if (text.length > 0) {
            setLoading(true);
            const data = await searchAll(text);
            setResults(data);
            setLoading(false);
        } else {
            setResults(null);
            setLoading(false);
        }
    };

    // --- REUSABLE COMPONENT FOR HORIZONTAL LISTS ---
    const ResultSection = ({ title, list, type }) => {
        if (!list || list.length === 0) return null;

        return (
            <View style={styles.sectionContainer}>
                {/* Title has padding so it aligns with search bar */}
                <Text style={styles.sectionTitle}>{title}</Text>
                <FlatList
                    data={list}
                    horizontal={true} // <--- ENSURES SCROLLING SIDEWAYS
                    showsHorizontalScrollIndicator={false}
                    // This padding allows the list to scroll "Edge to Edge"
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => {
                                addToHistory(item); // Save to history
                                if (type === 'track') {
                                    playTrack(item);
                                } else {
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
        // REMOVED 'paddingHorizontal' from here so lists touch the edges
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
                results ? (
                    // 1. SCROLLVIEW FOR RESULTS (Vertical)
                    // keyboardShouldPersistTaps="handled" fixes tap issues while scrolling
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 100 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <ResultSection title="Songs 🎵" list={results.tracks} type="track" />
                        <ResultSection title="Artists 🎤" list={results.artists} type="artist" />
                        <ResultSection title="Albums 💿" list={results.albums} type="album" />

                        {results.tracks.length === 0 && results.artists.length === 0 && (
                            <Text style={{ color: 'gray', textAlign: 'center', marginTop: 20 }}>No results found.</Text>
                        )}
                    </ScrollView>
                ) : (
                    // 2. VIEW FOR HISTORY (Vertical)
                    // Added paddingHorizontal here because this list SHOULD have margins
                    <View style={{ flex: 1, paddingHorizontal: 20 }}>
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 15}}>
                            <Text style={[styles.sectionTitle, {marginLeft: 0}]}>Recent Searches</Text>
                            {history.length > 0 && (
                                <TouchableOpacity onPress={clearHistory}>
                                    <Text style={{color: '#B3B3B3', fontSize: 12}}>Clear</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <FlatList
                            data={history}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.historyItem}
                                    onPress={() => {
                                        if (item.type === 'track' || !item.type) playTrack(item);
                                        else router.push(`/details/${item.type}/${item.id}`);
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.cover_medium || item.picture_medium || item.album?.cover_medium }}
                                        style={styles.historyImage}
                                    />
                                    <View style={{marginLeft: 15, flex: 1}}>
                                        <Text style={{color: 'white', fontSize: 16}} numberOfLines={1}>{item.title || item.name}</Text>
                                        <Text style={{color: '#B3B3B3', fontSize: 12}}>{item.type || 'track'}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => removeFromHistory(item.id)}
                                        style={{ padding: 10 }} // Hitbox padding so it's easier to click
                                    >
                                        <Ionicons name="close" size={20} color="gray" />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={{color: 'gray', textAlign:'center', marginTop: 20}}>No recent searches.</Text>
                            }
                        />
                    </View>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // REMOVED 'paddingHorizontal: 20' to fix scrolling
    container: { flex: 1, backgroundColor: '#121212', paddingTop: 50 },

    // Added margin here instead
    header: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20, marginLeft: 20 },

    // Added margin here instead
    searchBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#333',
        borderRadius: 10, paddingHorizontal: 15, height: 50, marginBottom: 20,
        marginHorizontal: 20 // <--- Keeps the box centered
    },
    input: { flex: 1, color: 'white', fontSize: 16 },

    sectionContainer: { marginBottom: 30 },

    // Added margin here instead
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 15, marginLeft: 20 },

    card: { marginRight: 15, width: 120 },
    albumImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
    artistImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },

    cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    cardSubtitle: { color: 'gray', fontSize: 12 },

    historyItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
        borderBottomWidth: 1, borderBottomColor: '#222'
    },
    historyImage: { width: 50, height: 50, borderRadius: 25 }
});