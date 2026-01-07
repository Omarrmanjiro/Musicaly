"use client"

import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native"
import { usePlayer } from "../../src/context/MockPlayerContext"
import { LinearGradient } from "expo-linear-gradient"
import Slider from "@react-native-community/slider"
import { useState, useEffect } from "react"

const { width } = Dimensions.get("window")

const trackColors = {
  red: { primary: "#E63946", secondary: "#A4161A", light: "#F77F88" },
  blue: { primary: "#457B9D", secondary: "#1D3557", light: "#A8DADC" },
  purple: { primary: "#9D4EDD", secondary: "#5A189A", light: "#C77DFF" },
  orange: { primary: "#F77F00", secondary: "#D62828", light: "#FCBF49" },
  green: { primary: "#06A77D", secondary: "#004E40", light: "#43C59E" },
  pink: { primary: "#FF006E", secondary: "#C7184C", light: "#FF69B4" },
}

const getTrackColor = (trackId) => {
  const colors = Object.values(trackColors)
  const index = trackId ? trackId.charCodeAt(0) % colors.length : 0
  return colors[index]
}

export default function PlayerScreen() {
  const {
    togglePlay,
    next,
    previous,
    isPlaying,
    currentTrack,
    progress,
    duration,
    seek,
    toggleShuffle,
    toggleRepeat,
    isShuffle,
    repeatMode,
  } = usePlayer()

  const [isSeeking, setIsSeeking] = useState(false)
  const [seekPosition, setSeekPosition] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!isSeeking) {
      setSeekPosition(progress)
    }
  }, [progress, isSeeking])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSeekStart = () => {
    setIsSeeking(true)
  }

  const handleSeekChange = (value) => {
    setSeekPosition(value)
  }

  const handleSeekComplete = (value) => {
    setIsSeeking(false)
    seek?.(value)
  }

  const track = currentTrack || {
    title: "No Track Playing",
    artist: "Unknown Artist",
    album: "Unknown Album",
    artwork: null,
    playlist: "Liked Songs",
  }

  const currentColor = getTrackColor(track.title)

  return (
    <LinearGradient colors={[currentColor.primary, currentColor.secondary]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>−</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSubtitle}>NOW PLAYING</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {track.playlist || "Liked Songs"}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Album Artwork */}
      <View style={styles.artworkContainer}>
        {track.artwork ? (
          <Image source={{ uri: track.artwork }} style={styles.artwork} resizeMode="cover" />
        ) : (
          <View style={[styles.artworkPlaceholder, { backgroundColor: currentColor.light }]}>
            <Text style={styles.artworkPlaceholderText}>♪</Text>
          </View>
        )}
      </View>

      {/* Track Info with Like Button */}
      <View style={styles.trackInfo}>
        <View style={styles.trackTitleRow}>
          <View style={styles.trackTextContainer}>
            <Text style={styles.trackTitle} numberOfLines={2}>
              {track.title}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {track.artist}
            </Text>
          </View>
          <TouchableOpacity style={styles.heartButton} onPress={() => setIsLiked(!isLiked)}>
            <Text style={[styles.heartIcon, isLiked && styles.heartIconLiked]}>{isLiked ? "♥" : "♡"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration || 100}
          value={seekPosition}
          onSlidingStart={handleSeekStart}
          onValueChange={handleSeekChange}
          onSlidingComplete={handleSeekComplete}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="rgba(255,255,255,0.3)"
          thumbTintColor="#FFFFFF"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(seekPosition)}</Text>
          <Text style={styles.timeText}>{formatTime(duration || 0)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle} style={styles.controlIconContainer}>
          <Text style={[styles.controlIcon, isShuffle && styles.activeControl]}>↻</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={previous} style={styles.controlButton}>
          <Text style={styles.controlIconLarge}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
          <Text style={styles.playIcon}>{isPlaying ? "∥" : "▶"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={next} style={styles.controlButton}>
          <Text style={styles.controlIconLarge}>⏭</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleRepeat} style={styles.controlIconContainer}>
          <Text style={[styles.controlIcon, repeatMode !== "off" && styles.activeControl]}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomActionIcon}>≈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomActionIcon}>⤴</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  headerButton: {
    padding: 8,
  },
  headerIcon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "300",
    letterSpacing: 1,
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 16,
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
    fontSize: 32,
    color: "#fff",
  },
  heartIconLiked: {
    color: "#FFD700",
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
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  controlButton: {
    padding: 12,
  },
  controlIconContainer: {
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
    fontSize: 28,
    color: "#000",
    fontWeight: "600",
    marginLeft: 2,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 32,
  },
  bottomButton: {
    padding: 8,
  },
  bottomActionIcon: {
    fontSize: 20,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "300",
  },
})
