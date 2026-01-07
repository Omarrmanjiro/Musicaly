import { createContext, useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [sound, setSound] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playTrack(track, newQueue = []) {
    if (sound) {
      await sound.unloadAsync();
    }

    if (newQueue.length) {
      setQueue(newQueue);
      setCurrentIndex(newQueue.findIndex(t => t.id === track.id));
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: track.preview },
      { shouldPlay: true }
    );

    setSound(newSound);
    setIsPlaying(true);
  }

  async function togglePlay() {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  async function next() {
    if (currentIndex + 1 >= queue.length) return;
    playTrack(queue[currentIndex + 1], queue);
    setCurrentIndex(i => i + 1);
  }

  async function previous() {
    if (currentIndex === 0) return;
    playTrack(queue[currentIndex - 1], queue);
    setCurrentIndex(i => i - 1);
  }

  return (
    <PlayerContext.Provider
      value={{ playTrack, togglePlay, next, previous, isPlaying }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
