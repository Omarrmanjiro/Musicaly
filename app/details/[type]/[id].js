import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { getCollectionDetails } from '../../../src/services/deezer';
import { useMusic } from '../../../src/context/MusicContext';
import { Ionicons } from '@expo/vector-icons';

export default function DetailScreen() {
    const { type, id } = useLocalSearchParams(); // Reads the URL (e.g., type="album", id="123")
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setCurrentTrack } = useMusic();
    const router = useRouter();

    useEffect(() => {
        async function loadTracks() {
            const data = await getCollectionDetails(type, id);
            setTracks(data);
            setLoading(false);
        }
        loadTracks();
    }, [type, id]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => setCurrentTrack(item)}
        >
            <Text style={styles.trackNumber}>{tracks.indexOf(item) + 1}</Text>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist.name}</Text>
            </View>
            <Ionicons name="play-circle" size={24} color="#1DB954" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Custom Header with Back Button */}
            <Stack.Screen options={{
                headerShown: true,
                title: type ? type.toUpperCase() : 'DETAILS',
                headerStyle: { backgroundColor: '#121212' },
                headerTintColor: '#fff'
            }} />

            {loading ? (
                <ActivityIndicator size="large" color="#1DB954" style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={tracks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={{color:'gray', textAlign:'center', marginTop:20}}>No tracks found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    trackNumber: { color: 'gray', width: 30, fontSize: 14 },
    info: { flex: 1, marginRight: 10 },
    title: { color: 'white', fontSize: 16, fontWeight: '500' },
    artist: { color: 'gray', fontSize: 12 }
});