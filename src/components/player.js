"use client"

import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, FlatList, Alert, ActivityIndicator } from "react-native"

import { usePlayer } from "../context/PlayerContext"
import { LinearGradient } from "expo-linear-gradient"
import Slider from "@react-native-community/slider"
import { useEffect, useState } from "react"

import { getUserPlaylists, addSongToPlaylist } from "../services/firebasePlaylist"
const { width } = Dimensions.get("window")

const trackColors = [
  ["#E63946", "#A4161A"],
  ["#457B9D", "#1D3557"],
  ["#9D4EDD", "#5A189A"],
  ["#F77F00", "#D62828"],
  ["#06A77D", "#004E40"],
  ["#FF006E", "#C7184C"],
]

const getTrackColor = (seed) => {
  const index = seed ? seed.charCodeAt(0) % trackColors.length : 0
  return trackColors[index]
}

export default function PlayerScreen() {
  const {
    togglePlay,
    next,
    previous,
    isPlaying,
    progress,
    duration,
    seek,
    toggleShuffle,
    toggleRepeat,
    isShuffle,
    repeatMode,
    setIsExpanded, // ✅ ADDED
    currentTrack,
  } = usePlayer()

  const [isSeeking, setIsSeeking] = useState(false)
  const [seekPosition, setSeekPosition] = useState(0)
    // --- NEW CODE START ---
    const [modalVisible, setModalVisible] = useState(false);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(false);

    const openPlaylistModal = async () => {
        if (!currentTrack) return;
        setModalVisible(true);
        setLoadingPlaylists(true);
        const playlists = await getUserPlaylists();
        setUserPlaylists(playlists);
        setLoadingPlaylists(false);
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await addSongToPlaylist(playlistId, currentTrack);
            Alert.alert("Success", "Song added to playlist! 🎵");
            setModalVisible(false);
        } catch (error) {
            Alert.alert("Error", "Could not add song.");
        }
    };
    // --- NEW CODE END ---
  useEffect(() => {
    if (!isSeeking) setSeekPosition(progress || 0)
  }, [progress, isSeeking])

  const formatTime = (s = 0) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`

  const track = currentTrack
    ? {
      title: currentTrack.title || "Unknown Title",
      artist: currentTrack.artist?.name || "Unknown Artist",
      artwork: currentTrack.cover || currentTrack.album?.cover_big || currentTrack.artist?.picture_big || null,
      playlist: "Now Playing",
    }
    : {
      title: "No Track Playing",
      artist: "—",
      artwork: null,
      playlist: "—",
    }

  const [primary, secondary] = getTrackColor(track.title)

  return (
    <LinearGradient colors={[primary, secondary]} style={styles.container}>

      {/* 🔽 HEADER WITH COLLAPSE BUTTON (SPOTIFY STYLE) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsExpanded(false)}>
          <Text style={styles.collapseIcon}>⌄</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerSubtitle}>PLAYING FROM PLAYLIST</Text>
          <Text style={styles.headerTitle}>{track.playlist}</Text>
        </View>

        {/* Spacer to keep center aligned */}
        <View style={{ width: 28 }} />
      </View>

      {/* Artwork */}
      <View style={styles.artworkContainer}>
        {track.artwork ? (
          <Image source={{ uri: track.artwork }} style={styles.artwork} />
        ) : (
          <View style={styles.artworkPlaceholder}>
            <Text style={styles.artworkPlaceholderText}>♪</Text>
          </View>
        )}
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <View style={styles.trackTitleRow}>
          <View style={styles.trackTextContainer}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {track.title}
            </Text>
            <Text style={styles.trackArtist}>{track.artist}</Text>
          </View>
          <TouchableOpacity style={styles.heartButton}>
            <Text style={styles.heartIcon}>♡</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 1}
          value={seekPosition}
          onSlidingStart={() => setIsSeeking(true)}
          onSlidingComplete={(v) => {
            setIsSeeking(false)
            seek(v)
          }}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="rgba(255,255,255,0.3)"
          thumbTintColor="#fff"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(seekPosition)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleShuffle}>
          <Text style={[styles.controlIcon, isShuffle && styles.activeControl]}>⤮</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={previous}>
          <Text style={styles.controlIconLarge}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
          <Text style={styles.playIcon}>{isPlaying ? "❚❚" : "▶"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={next}>
          <Text style={styles.controlIconLarge}>⏭</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={toggleRepeat}>
          <Text style={[styles.controlIcon, repeatMode !== "off" && styles.activeControl]}>
            {repeatMode === "off" ? "↻" : repeatMode === "one" ? "1↻" : "∞"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomActionIcon}>🔊</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={openPlaylistModal}>
              <Text style={styles.bottomActionIcon}>➕</Text>
          </TouchableOpacity>
      </View>
        {/* new code */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add to Playlist</Text>
                    {loadingPlaylists ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : (
                        <FlatList
                            data={userPlaylists}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                // 1. CHECK: Is the current song already in this playlist?
                                const isAdded = (item.songs || []).some(
                                    savedSong => savedSong.id.toString() === currentTrack?.id.toString()
                                );

                                return (
                                    <TouchableOpacity
                                        style={styles.playlistItem}
                                        // 2. DISABLE click if already added
                                        onPress={() => !isAdded && handleAddToPlaylist(item.id)}
                                        activeOpacity={isAdded ? 1 : 0.7} // Remove click effect if added
                                    >
                                        {/* 3. ICON: Change from Note (🎵) to Check (✅) */}
                                        <Text style={styles.playlistIcon}>
                                            {isAdded ? "✅" : "🎵"}
                                        </Text>

                                        {/* 4. TEXT: Dim the color if added */}
                                        <Text style={[
                                            styles.playlistName,
                                            isAdded && { color: '#B3B3B3' } // Turn gray if added
                                        ]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  collapseIcon: {
    fontSize: 28,
    color: "#fff",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginTop: 4,
  },

  /* REST IS UNCHANGED */
  artworkContainer: {
    alignItems: "center",
    marginBottom: 40,
    flex: 1,
    justifyContent: "center",
  },
  artwork: {
    width: width - 80,
    height: width - 80,
    borderRadius: 16,
  },
  artworkPlaceholder: {
    width: width - 80,
    height: width - 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  artworkPlaceholderText: {
    fontSize: 80,
    color: "rgba(255,255,255,0.3)",
  },
  trackInfo: { marginBottom: 24 },
  trackTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackTextContainer: { flex: 1 },
  trackTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  trackArtist: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },
  heartButton: { padding: 8 },
  heartIcon: { fontSize: 28, color: "#fff" },
  progressContainer: { marginBottom: 24 },
  slider: { width: "100%", height: 40 },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  controlButton: { padding: 12 },
  controlIcon: {
    fontSize: 24,
    color: "rgba(255,255,255,0.6)",
  },
  activeControl: { color: "#FFD700" },
  controlIconLarge: { fontSize: 36, color: "#fff" },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    fontSize: 24,
    color: "#000",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 32,
  },
  bottomButton: { padding: 8 },
  bottomActionIcon: {
    fontSize: 20,
    color: "rgba(255,255,255,0.6)",
  },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#222',
        borderRadius: 20,
        padding: 20,
        maxHeight: '50%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        textAlign: 'center',
    },
    playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    playlistIcon: {
        fontSize: 20,
        marginRight: 15,
    },
    playlistName: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
})
