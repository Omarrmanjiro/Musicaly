"use client"

import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native"
import { useMusic } from "../../src/context/MusicContext"
import { usePlayer } from "../../src/context/PlayerContext"
import { LinearGradient } from "expo-linear-gradient"
import Slider from "@react-native-community/slider"
import { useEffect, useState } from "react"

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
  } = usePlayer()

  const { currentTrack } = useMusic()

  const [isSeeking, setIsSeeking] = useState(false)
  const [seekPosition, setSeekPosition] = useState(0)

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
        artwork: currentTrack.album?.cover_big || currentTrack.artist?.picture_big || null,
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSubtitle}>PLAYING FROM PLAYLIST</Text>
          <Text style={styles.headerTitle}>{track.playlist}</Text>
        </View>
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
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomActionIcon}>📃</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  artworkPlaceholder: {
    width: width - 80,
    height: width - 80,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  artworkPlaceholderText: {
    fontSize: 80,
    color: "rgba(255,255,255,0.3)",
    fontWeight: "300",
  },
  trackInfo: {
    marginBottom: 24,
  },
  trackTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  trackTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 34,
  },
  trackArtist: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  heartButton: {
    padding: 8,
  },
  heartIcon: {
    fontSize: 28,
    color: "#fff",
  },
  progressContainer: {
    marginBottom: 24,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: -8,
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  controlButton: {
    padding: 12,
  },
  controlIcon: {
    fontSize: 24,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "300",
  },
  activeControl: {
    color: "#FFD700",
  },
  controlIconLarge: {
    fontSize: 36,
    color: "#fff",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  playIcon: {
    fontSize: 24,
    color: "#000",
    fontWeight: "600",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  bottomButton: {
    padding: 8,
  },
  bottomActionIcon: {
    fontSize: 20,
    color: "rgba(255,255,255,0.6)",
  },
})
