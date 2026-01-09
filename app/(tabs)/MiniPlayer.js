import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from "react-native"

import { usePlayer } from "../../src/context/PlayerContext"
import { useRouter } from "expo-router"
import PlayerScreen from "./player"

export default function MiniPlayer() {
  const { isPlaying, togglePlay, currentTrack, setIsExpanded, isExpanded } = usePlayer()
  const router = useRouter()



  if (!currentTrack) return null // ⛔ nothing playing → nothing shown

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.container}
        onPress={() => setIsExpanded(true)}
      >
        <Image
          source={{
            uri:
              currentTrack.album?.cover_small ||
              currentTrack.artist?.picture_small,
          }}
          style={styles.cover}
        />

        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist?.name}
          </Text>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation()
            togglePlay()
          }}
        >
          <Text style={styles.play}>
            {isPlaying ? "❚❚" : "▶"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        visible={isExpanded}
        animationType="slide"
        onRequestClose={() => setIsExpanded(false)}
      >
        <PlayerScreen />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "#181818",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  text: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    color: "#fff",
    fontWeight: "600",
  },
  artist: {
    color: "#aaa",
    fontSize: 12,
  },
  play: {
    color: "#fff",
    fontSize: 24,
  },
})
