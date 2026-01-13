import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import React, { useEffect, useState, useCallback, memo } from 'react';
import { getChart } from '../../src/services/deezer';
import { useMusic } from '../../src/context/MusicContext';
import { usePlayer } from '../../src/context/PlayerContext';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

/*  MEMOIZED SECTION (VERY IMPORTANT) */
const Section = memo(({ title, list, onPress }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
            data={list}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => onPress(item)}
                >
                    <Image
                        source={{
                            uri:
                                item.cover_medium ||
                                item.picture_medium ||
                                item.album?.cover_medium
                        }}
                        style={styles.cover}
                    />
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                        {item.artist?.name || item.user?.name}
                    </Text>
                </TouchableOpacity>
            )}
        />
    </View>
));

export default function HomeScreen() {
    const [data, setData] = useState({ tracks: [], albums: [], playlists: [] });
    const [loading, setLoading] = useState(true);

    const { playTrack } = usePlayer(); 

    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const chartData = await getChart();
            setData(chartData);
            setLoading(false);
        })();
    }, []);

    /* MEMOIZED PRESS HANDLER */
    const handlePress = useCallback((item) => {
        if (item.type === 'track') {
            playTrack(item);
        } else {
            router.push(`/details/${item.type}/${item.id}`);
        }
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.dispatch(DrawerActions.openDrawer())
                    }
                >
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/300' }}
                        style={styles.headerAvatar}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Good Morning ☀️</Text>
            </View>

            <Section
                title="Top Tracks 🔥"
                list={data.tracks}
                onPress={handlePress}
            />
            <Section
                title="Top Albums 💿"
                list={data.albums}
                onPress={handlePress}
            />
            <Section
                title="Hot Playlists 🎧"
                list={data.playlists}
                onPress={handlePress}
            />

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', paddingTop: 50 },

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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 20,
        marginBottom: 15
    },

    card: { marginLeft: 20, width: 140 },
    cover: { width: 140, height: 140, borderRadius: 10, marginBottom: 10 },
    cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    cardSubtitle: { color: 'gray', fontSize: 12 }
});
